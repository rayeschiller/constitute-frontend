### Exposing Sexism in Politics On Twitter

This project displays data visualizations about toxicity on Twitter for various high profile politicians. 
The data was collected by querying the Twitter API periodically and dates back to early 2019. 
We queried the Twitter API and searched for key words including the politician's first and last name and their twitter handles. 
In order to get information about the sentiment of the tweet, we used the Perspective API, an API used to detect abuse and harassment online. 
Perspective API has the ability to detect multiple attributes. We used toxicity, identity attack, and sexually explicit. 
Perspective API returns a score from 0 to 1 on the probability of each of these attributes given the text. 
It should be noted that there are known unintended biases within the Perspective API.

View at : https://rinaschiller.github.io/political-tweet-toxicity/
