#
# 2021-12-12 dbj at dbj dot org 
# if connected be sure to disconnect VPN before starting this
#
import pandas as pd
import requests
import mplfinance as mf
import re

# def into_valid_filename(s):
#     s = str(s).strip().replace(' ', '_')
#     return re.sub(r'(?u)[^-\w.]', '', s)

# Extracting stock data
# for crash course see: https://support.twelvedata.com/en/articles/5335783-trial

# def get_historical_data(symbol, start_date):
#     api_key = '4f16f809913b4506be8e27694d196869'
#     api_url = f'https://api.twelvedata.com/time_series?symbol={symbol}&interval=1day&outputsize=5000&apikey={api_key}'
#     raw_df = requests.get(api_url).json()
#     df = pd.DataFrame(raw_df['values']).iloc[::-1].set_index('datetime').astype(float)
#     df = df[df.index >= start_date]
#     df.index = pd.to_datetime(df.index)
#     return df

import yfinance

ticker_name = 'FIS'
ticker_data = yfinance.Ticker(ticker_name)
ticker_data = ticker_data.history(period='1y')    

# const ticker_name = 'BTC/USD'
ticker_start_date_iso = '2021-01-01'
# ticker_data = get_historical_data(ticker_name, ticker_start_date_iso)
ticker_data.tail()

plot_title = "{} stock price".format( ticker_name )

valid_plot_file_name =  "{}.png".format(  re.sub('[^\w_.)( -]', '_', plot_title ) )

plot_title = "{}, from {} to date".format(plot_title, ticker_start_date_iso)

# # 1. OHLC Chart

# mf.plot(ticker_data.iloc[:-50,:])

# # 2. Candlestick Chart

# mf.plot(ticker_data.iloc[:-50,:], type = 'candle')

# # 3. Renko Chart

# mf.plot(ticker_data, type = 'renko')

# # 4. Point and Figure Chart

# mf.plot(ticker_data, type = 'pnf')

# # 5. Technical chart

# mf.plot(ticker_data, mav = (10, 20), type = 'candle', volume = True)

# 6. Plot customization

volume_plot_request = False

mf.plot(ticker_data, mav = (5, 10, 20), type = 'candle', 
        volume = volume_plot_request, figratio = (10,5), 
        style = 'binance', title = plot_title, 
        tight_layout = True)

# 7. Saving the plot

mf.plot(ticker_data, mav = (5, 10, 20), type = 'candle', 
        volume = volume_plot_request, figratio = (10,5), 
        style = 'binance', title = plot_title, 
        tight_layout = True, savefig =  valid_plot_file_name )