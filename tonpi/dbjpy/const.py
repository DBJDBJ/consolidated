#
# http://web.archive.org/web/20100523132518/http://code.activestate.com/recipes/65207-constants-in-python/?in=user-97991
# 
class _const:
    __dict__ = {} # empty dictionary data member, declaration is not required in python
                  # it will be created first time you use it: self.__dict__[key] = val
                  # that makes a mockery out of python. probably
    class ConstError(TypeError): pass
    
    def __setattr__(self,name,value):
        # has_key was removed in Python 3 -- self.__dict__.has_key(name):
        # in python3, has_key(key) is replaced by __contains__(key)
        if name in self.__dict__ :
            raise self.ConstError("Can't rebind const(%s)"%name)
        self.__dict__[name]=value
#
# dbj: is this necessary?
#         
import sys
sys.modules[__name__]=_const()

"""
# that's all -- now any client-code can
import const
# and bind an attribute ONCE:
const.magic = 23
# but NOT re-bind it:
const.magic = 88      # raises const.ConstError
# you may also want to add the obvious __delattr__
"""