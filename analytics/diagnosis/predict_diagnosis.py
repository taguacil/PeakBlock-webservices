"""
=============================================================================
Title    : Main peakblock script
Project  : PeakBlock
File     : run.py
-----------------------------------------------------------------------------

    Description:

    This file contains the main routines for running the inference algorithm
    for the diagnosis of COVID 19


-----------------------------------------------------------------------------
Major Revisions:
    Date            Version     Name        Description
    28-Mar-2020     1.0         Ramy        First iteration of the script
"""

# Python library import
import numpy as np
import pandas as pd
import importlib


class DiagnosisPredictor:
    def __init__(self, config):
        self.model_type = config['model_type']
        self.model_hyperparams = config['model_hyperparams']
        self.model_module = importlib.import_module('.'+self.model_type, package='diagnosis_algorithms')
        self.model = self.model_module.PredictorClass(self.model_params)

    def run_inference(self, features):
        """
        This function runs the feature selection and prediction routines of the generic model
        :param features: Pandas DataFrame, columns will be the features and the indices are the various instances
        :return: Pandas Series of Covid 19 probabilities
        """
        processed_features = self.model.feature_selection(features)
        covid_probability = self.model.predict(processed_features)
        return covid_probability


if __name__ == '__main__':
    config = {
        'model_type': 'naive_bayes',
        'model_hyperparams': {},
    }
    features = pd.Series({
        'dry_cough': 1,
        'fever': 0,
        'difficulty_breathing': 0
    })
    predictorObj = DiagnosisPredictor(config)
    print(predictorObj.run_inference(features))
