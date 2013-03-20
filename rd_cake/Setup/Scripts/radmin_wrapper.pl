#! /usr/bin/perl -w
use strict;

if ($#ARGV < 0) {
    print q{
=============================================================
|                                                           |
|               RADIUSdesk radmin wrapper                   |
|        http://sourceforge.net/projects/radiusdesk/        |
|                                                           |
|-----------------------------------------------------------|
|  Syntax - radmin_wrapper.pl stats [auth|acct] <client IP> |
|                                                           |
=============================================================
};
    exit;
} elsif ($#ARGV < 1) {
    print "You have not provided all of the arguments required\n";
    exit;
}

my $arg1 = $ARGV[0];
my $arg2 = $ARGV[1];
my $arg3 = '';
if(exists($ARGV[2])){
    $arg3 = $ARGV[2];
}

if($arg1 eq 'stats'){
    my $return_val = `radmin -e "stats client $arg2 $arg3"`;
    print($return_val);
}
