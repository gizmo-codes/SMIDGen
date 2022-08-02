import nltk
import json
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
nltk.download('punkt')
nltk.download('stopwords')

stop_words = set(stopwords.words('english'))
#could add more stopwords if necessary with stop_words.add(word)

with open('textSentences.json', 'r') as fcc_file:
  data = json.load(fcc_file)
data = str(data)

#theres almost certainly a better way to do this but it works
data = data.replace('.', ' ');data = data.replace('\\n', ' ');data = data.replace('{', ' ');data = data.replace('1', ' ');data = data.replace('2', ' ')
data = data.replace('3', ' ');data = data.replace('4', ' ');data = data.replace('5', ' ');data = data.replace('6', ' ');data = data.replace('7', ' ')
data = data.replace('8', ' ');data = data.replace('9', ' ');data = data.replace('0', ' ');data = data.replace('!', ' ');data = data.replace('?', ' ')
data = data.replace(',', ' ');data = data.replace('\'', ' ')

#=================== This section would have to be different to properly work with smidgen input data ===================#
data = data.split(" ")
data2 = []
for item in data:
  if item != '':
    data2.append(item.lower())
data3 = []
for item in data2:
  if item not in stop_words:
    data3.append(item)
#========================================================================================================================#

#single token ranking
dataTokens = [w for w in data3]
frequency_dist = nltk.FreqDist(dataTokens)
sorted(frequency_dist,key=frequency_dist.__getitem__, reverse=True)
print(" word occurence ranking | top 50")
print(frequency_dist.most_common(50))

itr = 0; pairs = []
while itr < len(data3) -1:
  pairs.append(data3[itr] + " " + data3[itr+1])
  itr += 1

#word coocurence ranking
pairTokens = [w for w in pairs]
pairFrequency_dist = nltk.FreqDist(pairTokens)
sorted(pairFrequency_dist,key=pairFrequency_dist.__getitem__, reverse=True)
print("word cooccurence ranking | top 50")
print(pairFrequency_dist.most_common(50))
