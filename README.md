# asl-server

The `asl-server` is a Python application that provides a platform for American Sign Language (ASL) recognition. This project includes a pre-trained model for ASL alphabet prediction and a utility for generating video frames of ASL signs for a given text.
## Features

- The `src/featurs/app.py` file is the entry point of the server and it defines the main functionality of the application. It uses the SignPredict class from the preprocess module to make predictions of ASL signs from input mediapipe hands landmarks, and the SignToText class from the same module to generate video frames of ASL signs for a given text input. 
- It creates a socket connection using `socketio` and exposes several events that the web application can listen to and respond to. These events include `connect`, `disconnect`, `stream_text`, and `stream_sign`. The `stream_text` event takes in a piece of text and then streams back the ASL signs that correspond to the text. The `stream_sign` event takes in a sequence of hand landmarks frames and returns the predicted ASL sign.
- `preprocess.py`: A script that contains the `SignPredict` and `SignToText` classes. The `SignPredict` class uses a pre-trained machine learning model to classify ASL signs from a set of hand landmarks. The `SignToText` class takes a text input and returns a generator of the corresponding ASL sign video frames.
- The `SignToText` class in the `preprocess.py` file is responsible for processing the input text and generating the corresponding ASL sign video frames. It uses the `nltk` library to tokenize and lemmatize the input text, and then maps the resulting words to the corresponding ASL signs using a dictionary.
- The `SignPredict` class in the preprocess.py file is responsible for predicting the text corresponding to an input ASL sign. It uses a pre-trained support vector machine (SVM) model to make predictions based on the input hand landmarks.
- `signs.py`: A script that contains the ASL signs and their corresponding id.
- `public/`: A directory that contains the front-end files for the server, including HTML, CSS, and JavaScript files.
- `data/videos/`: A directory that contains the video frames for each ASL sign.
- `model/`: A directory that contains the pre-trained machine learning model for ASL sign classification.


## Installation

To use the asl-server, you will need to have Python 3.6 or later installed on your machine. Once you have Python installed, you can clone this repository and install the required dependencies using pip:
- git clone https://github.com/hasib457/asl-server.git
- cd asl-server
- pip install -r requirements.txt

## Usage

To start the server, run the following command from the root directory of the project:
- cd src/features
- python3 app.py


This will start the server on port 8080. Once the server is started, You can then access the server in your web browser at http://localhost:8080 or clients can connect to it and use the available functionality. 
