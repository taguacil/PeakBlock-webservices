"""
=============================================================================
Title    : Logger
Project  : PeakBlock
File     : logger.py
-----------------------------------------------------------------------------

    Description:

    This file contains the main logger instance


-----------------------------------------------------------------------------
Major Revisions:
    Date            Version     Name        Description
    28-Mar-2020     1.0         Taimir        First iteration of the script
"""
import logging
import logging.config
import os
import platform

if platform.system() == "Windows":
    ident = "\\"
else:
    ident = "/"

working_dir = os.getcwd()
param_path = working_dir + ident + "Input_files"+ ident


# Create logger
def create_logger(name):
    logdict = eval(open(param_path + "logging.config").read())
    logging.config.dictConfig(logdict)
    return logging.getLogger(name)
