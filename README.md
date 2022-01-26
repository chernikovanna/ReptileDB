# Reptile DB Data Mining

## Text Parsing

This project extracts information from Diagnosis tags in the reptile database.
We use Python's ```nltk``` to parse the unstructured text into values. The attributes/descriptors we are searching for include:

- Scale Counts
- Weight
- Length
- Snout-Length
- etc

### References

- [nltk](https://www.nltk.org/)
- [ReptileDB](http://www.reptile-database.org/) 

## Location Checklist

The project extracts information from the Distribution tags in the reptile database.
We maintain a relational matrix of Geographic regions and reptiles present. We display the information using D3.js and GeoJSON.

### References

- GeoJSON
- D3
