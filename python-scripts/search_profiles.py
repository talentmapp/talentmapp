# Python script to perform semantic search
def search_profiles(query):
    query_embedding = generate_embedding(query)
    results = collection.find({
        '$search': {
            'knn': {
                'vector': query_embedding,
                'k': 5 # Number of results to return
            }
        }
    })
    return list(results)
