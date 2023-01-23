import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, f1_score, recall_score, precision_score
from sklearn.svm import SVC
import seaborn as sns
import matplotlib.pyplot as plt
import datetime


def clean_data(data_dir):
    df = pd.read_csv(data_dir)
    df.columns = [i for i in range(df.shape[1])]
    df = df.rename(columns={42: 'Output'})
    all_null_values = df[df.iloc[:, 0] == 0].index
    df.drop(all_null_values, inplace=True)
    df = df.reset_index(drop=True)
    return df

def prepere_data(df):
    X = df.iloc[:, 0:42]
    y = df.iloc[:, 42]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    print(f"[INFO] X_train shape ={X_train.shape} y_train = {y_train.shape}")
    print(f"[INFO] X_test shape ={X_test.shape} y_test = {y_test.shape}")
    return X_train, X_test, y_train, y_test

def train_model(X_train, y_train):
    model = SVC(C=120, gamma=0.15, kernel='rbf')
    model.fit(X_train, y_train)
    print("[INFO] Training score =", model.score(X_train, y_train))
    return model

def test_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print("[INFO] Testing score =", accuracy)
    return y_pred

def plot_confusion_matrix(y_test, y_pred, plt_dir):
    cm = confusion_matrix(y_test, y_pred)
    
    labels = sorted(list(set(y_pred)))
    labels = [x.upper() for x in labels]

    fig, ax = plt.subplots(figsize=(12, 12))
    ax.set_title("Confusion Matrix - American Sign Language")

    maping = sns.heatmap(cm, annot=True,
                        cmap = plt.cm.Blues, 
                        linewidths=.2,
                        xticklabels=labels,
                        yticklabels=labels, vmax=8,
                        fmt='g',
                        ax=ax
                        )
    maping.figure.savefig(plt_dir)


def save_model(model, model_dir):
    pickle.dump(model, open(model_dir, 'wb'))

def main():
    data_dir = '../data/alphapet.csv'
    time = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
    pld_dir = 'confusion_matrix_'+time+'.png'
    model_dir = 'model_'+time+'.pkl'

    df = clean_data(data_dir)
    X_train, X_test, y_train, y_test = prepere_data(df)
    model = train_model(X_train, y_train)
    y_pred = test_model(model, X_test, y_test)
    plot_confusion_matrix(y_test, y_pred, pld_dir)
    save_model(model, model_dir)

if __name__ == '__main__':
    main()