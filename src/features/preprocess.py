import cv2, os, time, joblib
import numpy as np
from statistics import mode
from signs import signs, letters
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from dataclasses import dataclass
from nltk.corpus import stopwords

@dataclass
class SignToText():
    """
        process text and generate signs corresponding to text 
        take text and return list of sign's video frames
    """ 
    lemmatizer = WordNetLemmatizer()
    text : str = "Hello, how are you?"
    path : str = ''
    words  =[] #words and ids corresponding to words
    ids  = []

    def remove_punctuation(self, text=None)-> str:
        if text!=None:
            self.text= text
        self.text = self.text.lower()
        translator = str.maketrans('', '', "?:!.,;")
        self.text = self.text.translate(translator)
        return self.text

    def remove_stopwords(self, words=None)-> list:
        if words!=None:
            self.words=words        
            stop_words = set(stopwords.words("english"))
            filtered_text = []
            for word in self.words:
                if word in ["n’t", "’t"]:
                    filtered_text.append("not")
                else:
                    filtered_text.append(word)
            self.words = filtered_text
            return  self.words

    def lemmatize_word(self, words=None)-> list:
        if words!=None:
            self.words=words
        # provide context i.e. part-of-speech
        lemmas_v = [self.lemmatizer.lemmatize(word, pos ='v') for word in self.words]
        lemmas_n = [self.lemmatizer.lemmatize(word, pos ='n') for word in lemmas_v]
        lemmas_a = [self.lemmatizer.lemmatize(word, pos ='a') for word in lemmas_n]
        lemmas_r = [self.lemmatizer.lemmatize(word, pos ='r') for word in lemmas_a]
        self.words = lemmas_r
        return self.words

    def word_id(self, words=None)->list:
        if words!=None:
            self.words=words
        self.ids = []
        for word in self.words:
            id = signs.get(word)
            if id == None:
                for char in word:
                    self.ids.append(letters.get(char))
            else:
                self.ids.append(id)
        return self.ids
    
    def sign_gen(self, text=None): 
        """
            generate signs corresponding to text 
            take text and return generator of sign's video frames
        """ 
        if text != None:
            self.text = text
        self.remove_punctuation() # remove punctuation
        self.words = word_tokenize(self.text) # tokenize text 
        self.lemmatize_word() # lemmatize string
        self.remove_stopwords()    # remove stop words
        self.word_id()

        for id in self.ids:
            try:
                vid = cv2.VideoCapture(self.path + str(id) + ".mp4")
                for i in range(10):
                        success, frame = vid.read()  # read video frame
                for i in range(60):     
                    success, frame = vid.read()  # read video frame
                    if not success:
                        break
                    else:
                        time.sleep(0.01)  
                        width = int((frame.shape[1])*0.30)
                        height = int((frame.shape[0])*0.30)  
                        frame = cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA) 
                        ret, buffer = cv2.imencode('.jpg', frame)
                        frame = buffer.tobytes()
                        yield frame
            except:
                continue


class SignPredict():
    """
    predict sign from landmarks
    """
    def __init__(self, model_path : str):
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            raise Exception("Model not found")

    def sign_predict(self, landmarks):
        try:
            pred = []
            # loop over frames
            for frame in landmarks:
                cleaned = []
                try:
                    # extract landmarks from frame
                    for mark in frame.landmark:
                        cleaned.append(mark.x)
                        cleaned.append(mark.y)
                    cleaned = np.reshape(cleaned, (1,-1))
                except:
                    # extract landmarks from frame on anther way
                    for mark in frame:
                        cleaned.append(mark['x'])
                        cleaned.append(mark['y'])
                    cleaned = np.reshape(cleaned, (1,-1))
                # make prediction for each frame
                pred.append(self.model.predict(cleaned)[0])
            return mode(pred)
        except Exception as e:
            return e 
