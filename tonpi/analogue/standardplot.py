import matplotlib.pyplot as plt
import numpy as np 


x = np.linspace(0, 1, 100)     # Create a list of evenly-spaced numbers over the range
plt.plot(x, np.arctanh(x))          # Plot the sine of each x point
plt.grid()
plt.show()                      # Display the plot