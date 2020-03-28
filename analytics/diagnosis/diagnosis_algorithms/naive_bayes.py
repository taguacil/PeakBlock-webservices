"""
=============================================================================
Title    : Main peakblock script
Project  : PeakBlock
File     : run.py
-----------------------------------------------------------------------------

    Description:

    This file contains the main routines for a naive bayesian inference
    of probability of COVID 19 diagnosis given a set of features


-----------------------------------------------------------------------------
Major Revisions:
    Date            Version     Name        Description
    28-Mar-2020     1.0         Ramy        First iteration of the script
"""

# Python library import
import numpy as np
import pandas as pd

# User-defined library import
from .generic_algorithm import MasterPredictor


class PredictorClass(MasterPredictor):
    def __init__(self, config):
        super(PredictorClass, self).__init__(config)
        self.name = 'Naive Bayes'
        self.hyperparameters = {
            "prior": 0.001
        }

    def feature_selection(self, features):
        return features

    def predict(self, features):
        return np.random.random()

