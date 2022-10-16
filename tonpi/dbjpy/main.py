
import const
import sys

# actually strongly typed dictionary
# very slow and safe "solution"
class strong:
    def __init__(self,i):
        self.__type__ = type(i)
    def __setattr__(self,name,value):
        if (name.find('__type__') != 0) and (type(value) != self.__type__):
            raise TypeError( "(%s) is not %s"%(name,self.__type__.__name__) )
        self.__dict__[name]=value

if __name__ == '__main__':
    # that's all -- now any client-code can
    # and bind an attribute ONCE:
    const.magic = 23
    # but NOT re-bind it:
    # const.magic = 88      # raises const.ConstError
    # you may also want to add the obvious __delattr__

    i1 : int = strong(13)
    i1 = 42