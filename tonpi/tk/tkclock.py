# try:
# 	import TK
# except:
import tkinter as TK
import math	# Required For Coordinates Calculation
import time	# Required For Time Handling
import os
#
#
# class
class ClockApp(TK.Tk):

	# abs path of the current folder
	@staticmethod
	def folder () :
		return os.path.abspath(os.path.dirname(__file__))
		# return os.path.abspath(__file__)

	def __init__(self):
		TK.Tk.__init__(self)
		self.x=150	# Center Point x
		self.y=150	# Center Point
		self.length=50	# Stick Length
		self.creating_all_function_trigger()

	# Creating Trigger For Other Functions
	def creating_all_function_trigger(self):
		self.create_canvas_for_shapes()
		self.creating_background_()
		self.creating_sticks()
		return

	# Creating Background
	def creating_background_(self):
		abspath_filename = ClockApp.folder() + "\\clock.gif"
		self.image=TK.PhotoImage(file=abspath_filename)
		self.canvas.create_image(150,150, image=self.image)
		return

	# creating Canvas
	def create_canvas_for_shapes(self):
		self.canvas=TK.Canvas(self, bg='black')
		self.canvas.pack(expand='yes',fill='both')
		return

	# Creating Moving Sticks
	def creating_sticks(self):
		self.sticks=[]
		colors = ['red','green','blue']
		for i in range(3):
			store=self.canvas.create_line(self.x, self.y,self.x+self.length,self.y+self.length,width=4, fill=colors[i])
			self.sticks.append(store)
		return

	# Function Need Regular Update
	def update_class(self):
		now=time.localtime()
		t = time.strptime(str(now.tm_hour), "%H")
		hour = int(time.strftime( "%I", t ))*5
		now=(hour,now.tm_min,now.tm_sec)
		# Changing Stick Coordinates
		for n,i in enumerate(now):
				x,y=self.canvas.coords(self.sticks[n])[0:2]
				cr=[x,y]
				cr.append(self.length*math.cos(math.radians(i*6)-math.radians(90))+self.x)
				cr.append(self.length*math.sin(math.radians(i*6)-math.radians(90))+self.y)
				self.canvas.coords(self.sticks[n], tuple(cr))

# Main Function Trigger
if __name__ == '__main__':
	clock_ = ClockApp()
	# clock_.mainloop()
	# Creating Main Loop
	while True:
			clock_.update()
			clock_.update_idletasks()
			clock_.update_class()

	clock_.destroy() 
