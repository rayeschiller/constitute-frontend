#!/usr/bin/env python
# coding: utf-8

# In[122]:


import json
import pandas as pd
from matplotlib import pyplot as plt
import numpy as np


# In[123]:


warren = open('tweets_w.json')
biden = open('tweets_b.json')
sanders = open('tweets_s.json')
five_March = open('tweets_all.json')


# In[124]:


df_warren = pd.read_json(warren)
df_biden = pd.read_json(biden)
df_sanders = pd.read_json(sanders)
df = pd.read_json(five_March)


# In[125]:


df['politician'] = df['politician'].astype('str')
df['politician'] = df['politician'].str.slice(35,37,1)
#df['politician'] = df['politician'].astype('|S')
#df['politician'] = df['politician'].str.strip('/')


# In[126]:


pol_num_name = {58:'Joe Biden', 59: 'Pete Buttigieg', 60: 'Amy Klobucher', 
               1: 'Alexandr Ocasio-Cortez', 28: 'Bernie Sanders', 
                2: 'Ayanna Pressley', 3: 'Nancy Pelosi', 4: 'Elizabeth Warren',
                5: 'Kirsten Gillibrand', 6: 'Krysten Sinema', 7: 'Maxine Waters',
                8: 'Kamala Harris', 9: 'Deb Haaland', 10: 'Abigail Spanberger',
                11: 'Marilyn Mosby', 12: 'Susan Collins', 13: 'Lisa Murkowski',
                27: 'Chuck Schumer'}


# In[127]:


df['politician_num'] = df['politician'].str.strip('/')
df['politician_num'] = df['politician_num'].astype('int')
df['name'] = df['politician_num'].map(pol_num_name).astype('str')
df['text'] = df['text'].astype('str')
df['tweet_prev1'] = df['text'].str.slice(0,140,1)


# In[128]:


# count = 0
# for i in range(len(df)):
#     if df['toxicity'][i]>=0.5:
#         count+=1
# print(count)
# print(len(df))


# In[129]:


# toxicity_df = pd.DataFrame()
# toxicity_df['Politician'] =  df_warren['politician']
# toxicity_df['Date'] = df_warren['date']
# toxicity_df['Tweet'] = df_warren['text']
# toxicity_df['Toxicity'] = df_warren['toxicity']
# toxicity_df


# In[130]:


# warren_t = pd.DataFrame()
# sanders_t = pd.DataFrame()

# def filters(new_df, df_politician):
#     new_df = new_df.append(df_politician[df_politician['toxicity'] >= 0.5], ignore_index = True)
#     new_df.text = new_df.text.astype(str) 
#     return new_df


# In[131]:


# warren_t = filters(warren_t, df_warren)
# sanders_t = filters(sanders_t, df_sanders)


# In[136]:





# In[133]:


# size_w = (df['toxicity'])*50
# color = (df['politician_num'])
# #color_w = 'red'
# #(warren_t['identity_attack'])
# #for i in range(len(warren_t)):
# #    size.append((warren_t['toxicity'][i])*50)

# fig = go.Figure(data = go.Scatter(
#     x = df['date'], y = df['toxicity'], 
#     text = df.text.astype(str),
#     names = df.politician_num.astype(str),
#     hovertemplate = "%{names} <br> Tweet: %{text}",
#     mode='markers',
#     marker=dict(
#         size = size_w,
#         color = color,
# )))

# fig.show()


# In[138]:


import plotly.graph_objects as go
import plotly.express as px

size = (df['toxicity'])*100
color = df['name']
fig = px.scatter(df, x = 'identity_attack', 
                 y = 'toxicity',
                 color = color, 
                 size = size, 
                 hover_name = 'name', 
                 hover_data = ['tweet_prev1'])

fig.show()


# In[139]:


# size_w = (df_sanders['toxicity'])*50
# #color_w = 'red'
# #(warren_t['identity_attack'])
# #for i in range(len(warren_t)):
# #    size.append((warren_t['toxicity'][i])*50)

# fig = go.Figure(data = go.Scatter(
#     x = df_sanders['date'], y = df_sanders['toxicity'], 
#     text = df_sanders.text.astype(str),
#     hovertemplate = "<br> Tweet: %{text}",
#     mode='markers',
#     marker=dict(
#         size = size_w,
#         colorscale='Inferno',
#         showscale = True
# )))

# fig.show()


# In[137]:


plotly.offline.plot(fig, filename='tmd.html')


# In[140]:


with open('plotly_graph.html', 'w') as f:
    f.write(fig.to_html(include_plotlyjs='cdn'))


# In[ ]:




