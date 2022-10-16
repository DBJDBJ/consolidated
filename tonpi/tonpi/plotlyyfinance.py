import yfinance

ticker_name = 'FIS'
ticker_data = yfinance.Ticker(ticker_name)
hist = ticker_data.history(period='1y')

import plotly.graph_objects as go

# fig = go.Figure(data=go.Scatter(x=hist.index,y=hist['Close'], mode='lines+markers'))
# fig.show()

from plotly.subplots import make_subplots

# fig2 = make_subplots(specs=[[{"secondary_y": True}]])
# fig2.add_trace(go.Scatter(x=hist.index,y=hist['Close'],name='Price'),secondary_y=False)
# fig2.add_trace(go.Bar(x=hist.index,y=hist['Volume'],name='Volume'),secondary_y=True)
# fig2.update_yaxes(range=[0,7000000000],secondary_y=True)
# fig2.update_yaxes(visible=False, secondary_y=True)
# fig2.show()

fig3 = make_subplots(specs=[[{"secondary_y": True}]])
fig3.add_trace(go.Candlestick(x=hist.index,
                              open=hist['Open'],
                              high=hist['High'],
                              low=hist['Low'],
                              close=hist['Close'],
                              name='Price'))
fig3.add_trace(go.Scatter(x=hist.index,y=hist['Close'].rolling(window=20).mean(),marker_color='blue',name='20 Day MA'))
fig3.add_trace(go.Bar(x=hist.index, y=hist['Volume'], name='Volume'),secondary_y=True)

fig3.update_yaxes(range=[0,700000000],secondary_y=True)
fig3.update_yaxes(visible=False, secondary_y=True)
fig3.update_layout(xaxis_rangeslider_visible=False)  #hide range slider
fig3.update_layout(title={'text':ticker_name, 'x':0.5})
fig3.show()