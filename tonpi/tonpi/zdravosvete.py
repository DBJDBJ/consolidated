import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 20, 1000)  # Create a list of evenly-spaced numbers over the range

plt.plot(x, np.arccosh(x), linewidth = '12')       # Plot the sine of each x point
plt.grid()                   # 
plt.title("y = arccosh(x)")
plt.figtext(1,1,"Mistery Ticker", fontsize=14)

mgr = plt.get_current_fig_manager()
mgr.window.title('DBJ')
# mgr.window.wm_iconbitmap("icon.ico")


plt.show()                   # Display the plot