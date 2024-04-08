# Python script to generate embeddings for profile descriptions
import openai
import pymongo

openai.api_key = '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'

# Connect to MongoDB
client = pymongo.MongoClient('mongodb+srv://sarvag:mUsgWnuspL5CghIv@talentmapp.iks0k0t.mongodb.net/?retryWrites=true&w=majority&appName=talentmapp')
db = client['tm-mvp']
collection = db['profile']

# Function to generate embeddings
def generate_embedding(text):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=text,
        max_tokens=64,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return response.choices[0].text.strip()

# Generate embeddings for each profile
for profile in collection.find():
    embedding = generate_embedding(profile['summary'])
    collection.update_one({'_id': profile['_id']}, {'$set': {'embedding': embedding}})
