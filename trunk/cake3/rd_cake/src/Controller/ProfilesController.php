<?php
/**
 * Created by PhpStorm.
 * User: stevenkusters
 * Date: 18/01/2017
 * Time: 15:00
 */

namespace App\Controller;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

use Cake\Event\Event;
use Cake\Utility\Inflector;


class ProfilesController extends AppController
{
    protected $base = "Access Providers/Controllers/Profiles/";
    protected $owner_tree = array();
    protected $main_model = 'Profiles';

    public function initialize()
    {
        parent::initialize();

        $this->loadModel('Profiles');
        $this->loadModel('Users');
        $this->loadModel('Groups');
        
       // $this->loadModel('Radusergroups');
       // $this->loadModel('Radgroupchecks');

        $this->loadComponent('CommonQuery', [ //Very important to specify the Model
            'model' => 'Profiles'
        ]);
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtons');
        $this->loadComponent('Notes', [
            'model' => 'ProfileNotes',
            'condition' => 'profile_id'
        ]);
    }

    public function index_ap()
    {
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        $user_id = null;
        $admin_flag = false;

        if ($user['group_name'] == Configure::read('group.admin')) {  //Admin
            $user_id = $user['id'];
            $admin_flag = true;
        }

        if ($user['group_name'] == Configure::read('group.ap')) {
            $user_id = $user['id'];
        }//Or AP
        $items = array();
        $ap_id = false;

        if (isset($this->request->query['ap_id'])) {
            $ap_id = $this->request->query['ap_id'];
        }

        $query = $this->{$this->main_model}->find();

        if ($admin_flag) {
            $this->Profile->contain(array('Radusergroups' => array('Radgroupchecks')));

            $r = $query->all();
            foreach ($r as $j) {
         

                $data_cap_in_profile = false;
                $time_cap_in_profile = false;

                /*
                foreach($j['Radusergroup'] as $cmp){
                    foreach($cmp['Radgroupcheck'] as $chk){
                        //  print_r($chk);
                        if($chk['attribute'] == 'Rd-Reset-Type-Data'){
                            $data_cap_in_profile = true;
                        }
                        if($chk['attribute'] == 'Rd-Reset-Type-Time'){
                            $time_cap_in_profile = true;
                        }
                    }
                    unset($cmp['Radgroupcheck']);
                }
                */
                array_push($items,
                    array(
                        'id' => $j->id,
                        'name' => $j->name,
                        'data_cap_in_profile' => $data_cap_in_profile,
                        'time_cap_in_profile' => $time_cap_in_profile
                    )
                );
            }

        } else {
            //Access Providers needs more work...
            if ($ap_id == false) {
                $ap_id = $user_id;
            }
            if ($ap_id == 0) {
                $ap_id = $user_id;
            }
            $q_r = $this->User->getPath($ap_id); //Get all the parents up to the root

            foreach ($q_r as $i) {
                $user_id = $i['User']['id'];

                $this->Profile->contain(array('Radusergroup' => array('Radgroupcheck')));
                $r = $this->Profile->find('all', array('conditions' => array('Profile.user_id' => $user_id, 'Profile.available_to_siblings' => true)));
                foreach ($r as $j) {
                    $data_cap_in_profile = false;
                    $time_cap_in_profile = false;
                    /*
                    foreach ($j['Radusergroup'] as $cmp) {
                        if (array_key_exists('Radgroupcheck', $cmp)) {
                            foreach ($cmp['Radgroupcheck'] as $chk) {
                                if ($chk['attribute'] == 'Rd-Reset-Type-Data') {
                                    $data_cap_in_profile = true;
                                }
                                if ($chk['attribute'] == 'Rd-Reset-Type-Time') {
                                    $time_cap_in_profile = true;
                                }
                            }
                            unset($cmp['Radgroupcheck']);
                        }
                    }
                    */
                    array_push($items,
                        array(
                            'id' => $j->id,
                            'name' => $j->name,
                            'data_cap_in_profile' => $data_cap_in_profile,
                            'time_cap_in_profile' => $time_cap_in_profile
                        )
                    );
                }
            }
            //----------------
            //FIXME: There might be more of the hierarchical things that needs this add-on
            //We also need to list all the Profiles for this Access Provider NOT available to siblings
            //------------------
            $r = $this->Profile->find('all', array('conditions' => array('Profile.user_id' => $ap_id, 'Profile.available_to_siblings' => false)));
            foreach ($r as $j) {

                $data_cap_in_profile = false;
                $time_cap_in_profile = false;
                /*
                foreach($j['Radusergroup'] as $cmp){
                    if(array_key_exists('Radgroupcheck',$cmp)){
                        foreach($cmp['Radgroupcheck'] as $chk){
                            if($chk['attribute'] == 'Rd-Reset-Type-Data'){
                                $data_cap_in_profile = true;
                            }
                            if($chk['attribute'] == 'Rd-Reset-Type-Time'){
                                $time_cap_in_profile = true;
                            }
                        }
                        unset($cmp['Radgroupcheck']);
                    }
                }
                */
                array_push($items,
                    array(
                        'id' => $j->id,
                        'name' => $j->name,
                        'data_cap_in_profile' => $data_cap_in_profile,
                        'time_cap_in_profile' => $time_cap_in_profile
                    )
                );
            }


        }
        $this->set(array(
            'items' => $items,
            'success' => true,
            '_serialize' => array('items', 'success')
        ));

    }

    public function index()
    {
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        $user_id = $user['id'];

        $query = $this->{$this->main_model}->find();

        $this->CommonQuery->build_common_query($query, $user, ['Users', 'ProfileNotes' => ['Notes'],'Radusergroups'=> ['Radgroupchecks']]); //AP QUERY is sort of different in a way


        //===== PAGING (MUST BE LAST) ======
        $limit = 50;   //Defaults
        $page = 1;
        $offset = 0;
        if (isset($this->request->query['limit'])) {
            $limit = $this->request->query['limit'];
            $page = $this->request->query['page'];
            $offset = $this->request->query['start'];
        }


        $query->page($page);
        $query->limit($limit);
        $query->offset($offset);

        $total = $query->count();
        $q_r = $query->all();

        $items = array();

        foreach ($q_r as $i) {

            $owner_id = $i->user_id;
            if (!array_key_exists($owner_id, $this->owner_tree)) {
                $owner_tree = $this->Users->find_parents($owner_id);
            } else {
                $owner_tree = $this->owner_tree[$owner_id];
            }


            //Add the components (already from the highest priority
            $components = array();
            $data_cap_in_profile = false; // A flag that will be set if the profile contains a component with Rd-Reset-Type-Data group check attribute.
            $time_cap_in_profile = false; // A flag that will be set if the profile contains a component with Rd-Reset-Type-Time group check attribute.

            foreach ($i->radusergroups as $cmp){
                foreach ($cmp->radgroupchecks as $radgroupcheck) {
                    if($radgroupcheck->attribute == 'Rd-Reset-Type-Data'){
                        $data_cap_in_profile = true;
                    }
                    if($radgroupcheck->attribute == 'Rd-Reset-Type-Time'){
                        $time_cap_in_profile = true;
                    }              
                }
                $a = $cmp->toArray();
                unset($a['radgroupchecks']);
                array_push($components,$a);     
            }
            
            $action_flags = $this->Aa->get_action_flags($owner_id, $user);
            $notes_flag = false;
            foreach ($i->profile_notes as $un) {
                if (!$this->Aa->test_for_private_parent($un->note, $user)) {
                    $notes_flag = true;
                    break;
                }
            }
            
            array_push($items, array(
                'id'                    => $i->id,
                'name'                  => $i->name,
                'owner'                 => $owner_tree,
                'available_to_siblings' => $i->available_to_siblings,
                'profile_components'    => $components,
                'data_cap_in_profile'   => $data_cap_in_profile,
                'time_cap_in_profile'   => $time_cap_in_profile,
                'notes'                 => $notes_flag,
                'update'                => $action_flags['update'],
                'delete'                => $action_flags['delete']
            ));
        }

        //___ FINAL PART ___
        $this->set(array(
            'items' => $items,
            'success' => true,
            'totalCount' => $total,
            '_serialize' => array('items', 'success', 'totalCount')
        ));

    }

    public function index_for_filter()
    {

    }

    public function add()
    {

        if (!$this->_ap_right_check()) {
            return;
        }

        $user = $this->Aa->user_for_token($this);
        $user_id = $user['id'];

        // get creators id
        if ($this->request->data['user_id'] == '0') { //This is the holder of the token - override '0'
            $this->request->data['user_id'] = $user_id;
        }
        if (isset($this->request->data['available_to_siblings'])) {
            $this->request->data['available_to_siblings'] = 1;
        } else {
            $this->request->data['available_to_siblings'] = 0;
        }

        $entity = $this->{$this->main_model}->newEntity($this->request->data());
        if ($this->{$this->main_model}->save($entity)) {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        } else {
            $message = 'Error';
            $this->set(array(
                'errors' => $this->{$this->modelClass}->validationErrors,
                'success' => false,
                'message' => array('message' => __('Could not create item')),
                '_serialize' => array('errors', 'success', 'message')
            ));
        }

    }

    public function manageComponents()
    {
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        $user_id = $user['id'];

        $rb = $this->request->data['rb'];

        if (($rb == 'add') || ($rb == 'remove')) {
            $component_id = $this->request->data['component_id'];
            $this->ProfileComponent = ClassRegistry::init('ProfileComponent');
            $q_r = $this->ProfileComponent->findById($component_id);
            $component_name = $q_r['ProfileComponent']['name'];
        }

        foreach (array_keys($this->request->data) as $key) {
            if (preg_match('/^\d+/', $key)) {

                if ($rb == 'sub') {
                    $this->Profile->id = $key;
                    $this->Profile->saveField('available_to_siblings', 1);
                }

                if ($rb == 'no_sub') {
                    $this->Profile->id = $key;
                    $this->Profile->saveField('available_to_siblings', 0);
                }

                if ($rb == 'remove') {
                    $q_r = $this->Profile->findById($key);
                    $profile_name = $q_r['Profile']['name'];
                    $this->{$this->modelClass}->Radusergroup->deleteAll(
                        array('Radusergroup.username' => $profile_name, 'Radusergroup.groupname' => $component_name), false
                    );
                }

                if ($rb == 'add') {
                    $q_r = $this->Profile->findById($key);
                    $profile_name = $q_r['Profile']['name'];
                    $this->{$this->modelClass}->Radusergroup->deleteAll(   //Delete a previous one
                        array('Radusergroup.username' => $profile_name, 'Radusergroup.groupname' => $component_name), false
                    );
                    $d = array();
                    $d['username'] = $profile_name;
                    $d['groupname'] = $component_name;
                    $d['priority'] = $this->request->data['priority'];
                    $this->{$this->modelClass}->Radusergroup->create();
                    $this->{$this->modelClass}->Radusergroup->save($d);
                }
                //-------------
            }
        }

        $this->set(array(
            'success' => true,
            '_serialize' => array('success')
        ));

    }

    public function delete($id = null)
    {
        if (!$this->request->is('post')) {
            throw new MethodNotAllowedException();
        }

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }

        $user_id = $user['id'];
        $fail_flag = false;

        if (isset($this->data['id'])) {   //Single item delete
            $message = "Single item " . $this->data['id'];

            //NOTE: we first check of the user_id is the logged in user OR a sibling of them:
            $item = $this->{$this->modelClass}->findById($this->data['id']);
            $owner_id = $item['Profile']['user_id'];
            $profile_name = $item['Profile']['name'];
            if ($owner_id != $user_id) {
                if ($this->_is_sibling_of($user_id, $owner_id) == true) {
                    $this->{$this->modelClass}->id = $this->data['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    $this->{$this->modelClass}->Radusergroup->deleteAll(   //Delete a previous one
                        array('Radusergroup.username' => $profile_name), false
                    );
                } else {
                    $fail_flag = true;
                }
            } else {
                $this->{$this->modelClass}->id = $this->data['id'];
                $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                $this->{$this->modelClass}->Radusergroup->deleteAll(   //Delete a previous one
                    array('Radusergroup.username' => $profile_name), false
                );
            }

        } else {                          //Assume multiple item delete
            foreach ($this->data as $d) {

                $item = $this->{$this->modelClass}->findById($d['id']);
                $owner_id = $item['Profile']['user_id'];
                $profile_name = $item['Profile']['name'];
                if ($owner_id != $user_id) {
                    if ($this->_is_sibling_of($user_id, $owner_id) == true) {
                        $this->{$this->modelClass}->id = $d['id'];
                        $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                        $this->{$this->modelClass}->Radusergroup->deleteAll(   //Delete a previous one
                            array('Radusergroup.username' => $profile_name), false
                        );
                    } else {
                        $fail_flag = true;
                    }
                } else {
                    $this->{$this->modelClass}->id = $d['id'];
                    $this->{$this->modelClass}->delete($this->{$this->modelClass}->id, true);
                    $this->{$this->modelClass}->Radusergroup->deleteAll(   //Delete a previous one
                        array('Radusergroup.username' => $profile_name), false
                    );
                }
            }
        }

        if ($fail_flag == true) {
            $this->set(array(
                'success' => false,
                'message' => array('message' => __('Could not delete some items')),
                '_serialize' => array('success', 'message')
            ));
        } else {
            $this->set(array(
                'success' => true,
                '_serialize' => array('success')
            ));
        }
    }


    public function noteIndex()
    {
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        $items = $this->Notes->index($user);
    }

    public function noteAdd()
    {
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        $this->Notes->add($user);
    }

    public function noteDel()
    {
        if (!$this->request->is('post')) {
            throw new MethodNotAllowedException();
        }
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        $this->Notes->del($user);
    }

    public function menuForGrid()
    {
        $user = $this->Aa->user_for_token($this);
        if (!$user) {   //If not a valid user
            return;
        }

        $menu = $this->GridButtons->returnButtons($user, true, 'profiles'); 
        $this->set(array(
            'items' => $menu,
            'success' => true,
            '_serialize' => array('items', 'success')
        ));
    }


}
