import time

class Log():
    def __init__(self, logfile):
        self.logfile = logfile
        self.begin_t = time.time()

    def print_message(self, msg):
        message = "[%s] %s\n" % (Log.time_spent(self.begin_t), msg)
        with open( self.logfile, "a" ) as f:
            f.write( message )
            f.close()

    @staticmethod
    def time_spent(start):
        done = time.time()
        elapsed = done - start
        return time.strftime( "%H:%M:%S", time.gmtime(elapsed) )
