#list of imported modules
from tkinter import *
from math import cos, sin
from time import gmtime, sleep
from enum import Enum     # for enum34, or the stdlib version

CONST_PI = 3.141592

CLOCK_H  = 300    
CLOCK_W  = CLOCK_H    
CLOCK_CX = CLOCK_W / 2    
CLOCK_CY = CLOCK_H / 2    
CLOCK_R =  CLOCK_H - 20    

#defining of secondary functions

def drawcircle(Alpha,Beta,Rayon,Couleur,can): #draw a circle base on center coord radius and color
    x1,y1,x2,y2=Alpha-Rayon, Beta-Rayon, Alpha+Rayon, Beta+Rayon
    can.create_oval(x1,y1,x2,y2,fill=Couleur)

def drawPetAig(CoordA, CoordZ, Taille, Omega, can): #function to drawn the second hand of the clock
    Pi = CONST_PI
    Omega = ((Omega/60)+1)*30
    can.create_line(CoordA + (Taille/3) * cos(Pi*(Omega/180)), CoordZ + (Taille/3) * sin(Pi*(Omega/180)), CoordA - (Taille/8) * cos(Pi*(Omega/180)), CoordZ - (Taille/8) * sin(Pi*(Omega/180)) )

def drawGrdAig(CoordA, CoordZ, Taille, Omega, can): #function to draw the minute hand, based on center coord and minutes.
    Pi = CONST_PI
    Omega = (Omega-15)*6
    can.create_line(CoordA + (Taille/1.5) * cos(Pi*(Omega/180)), CoordZ + (Taille/1.5) * sin(Pi*(Omega/180)), CoordA - (Taille/6) * cos(Pi*(Omega/180)), CoordZ - (Taille/6) * sin(Pi*(Omega/180)))

def drawSecAig(CoordA, CoordZ, Taille, Omega, can): #function to draw the hour hand
    Pi = CONST_PI
    Omega = (Omega-15) *6
    can.create_line(CoordA + (Taille/1.5) * cos(Pi*(Omega/180)), CoordZ + (Taille/1.5) * sin(Pi*(Omega/180)), CoordA - (Taille/6) * cos(Pi*(Omega/180)), CoordZ - (Taille/6) * sin(Pi*(Omega/180)), fill = "red")

def fondhorloge(CoordA, CoordZ, Taille, canvas_):  #function drawing the backgroud of the clock
    Pi = CONST_PI
    drawcircle(CoordA, CoordZ, Taille + (Taille/10), "grey1",canvas_) #drawing the surrounding of the clock
    drawcircle(CoordA, CoordZ, Taille, "ivory3",canvas_)#backgroud
    drawcircle(CoordA, CoordZ, Taille/80, "grey6",canvas_)#central point/needle articulation
    canvas_.create_line(CoordA + (Taille - (Taille/15)), CoordZ, CoordA + (Taille - (Taille/5)), CoordZ) #drawing the N/S/E/W decorativ hour position
    canvas_.create_line(CoordA, CoordZ + (Taille - (Taille/15)), CoordA, CoordZ + (Taille - (Taille/5)))
    canvas_.create_line(CoordA - (Taille - (Taille/15)), CoordZ, CoordA - (Taille - (Taille/5)), CoordZ)
    canvas_.create_line(CoordA, CoordZ - (Taille - (Taille/15)), CoordA, CoordZ - (Taille - (Taille/5)))

    #here, this 4*2 line defined the position of the 8 intermediate line between the N/S/E/W decorativ line.
    canvas_.create_line(CoordA + (Taille/1.05) * cos(Pi*(30/180)), CoordZ + (Taille/1.05) * sin(Pi*(30/180)), CoordA + (Taille/1.20) * cos(Pi*(30/180)), CoordZ + (Taille/1.20) * sin(Pi*(30/180)))
    canvas_.create_line(CoordA + (Taille/1.05) * cos(Pi*(60/180)), CoordZ + (Taille/1.05) * sin(Pi*(60/180)), CoordA + (Taille/1.20) * cos(Pi*(60/180)), CoordZ + (Taille/1.20) * sin(Pi*(60/180)))

    canvas_.create_line(CoordA - (Taille/1.05) * cos(Pi*(30/180)), CoordZ - (Taille/1.05) * sin(Pi*(30/180)), CoordA - (Taille/1.20) * cos(Pi*(30/180)), CoordZ - (Taille/1.20) * sin(Pi*(30/180)))
    canvas_.create_line(CoordA - (Taille/1.05) * cos(Pi*(60/180)), CoordZ - (Taille/1.05) * sin(Pi*(60/180)), CoordA - (Taille/1.20) * cos(Pi*(60/180)), CoordZ - (Taille/1.20) * sin(Pi*(60/180)))

    canvas_.create_line(CoordA + (Taille/1.05) * cos(Pi*(30/180)), CoordZ - (Taille/1.05) * sin(Pi*(30/180)), CoordA + (Taille/1.20) * cos(Pi*(30/180)), CoordZ - (Taille/1.20) * sin(Pi*(30/180)))
    canvas_.create_line(CoordA + (Taille/1.05) * cos(Pi*(60/180)), CoordZ - (Taille/1.05) * sin(Pi*(60/180)), CoordA + (Taille/1.20) * cos(Pi*(60/180)), CoordZ - (Taille/1.20) * sin(Pi*(60/180)))

    canvas_.create_line(CoordA - (Taille/1.05) * cos(Pi*(30/180)), CoordZ + (Taille/1.05) * sin(Pi*(30/180)), CoordA - (Taille/1.20) * cos(Pi*(30/180)), CoordZ + (Taille/1.20) * sin(Pi*(30/180)))
    canvas_.create_line(CoordA - (Taille/1.05) * cos(Pi*(60/180)), CoordZ + (Taille/1.05) * sin(Pi*(60/180)), CoordA - (Taille/1.20) * cos(Pi*(60/180)), CoordZ + (Taille/1.20) * sin(Pi*(60/180)))

#PRINCIPLE FUNCTION (here the problem starts)

def HORLOGE1(Gamma , Pi, Epsylon):# draw a clock with the center position x/x = gamma/pi and the radius = epsylon

    fondhorloge(Gamma, Pi, Epsylon, canvas_)# extracting time value
    patate = gmtime()
    heure = patate[3] + 1  # "+1" is changing time from english time to french time :P
    minute = patate[4]
    seconde = patate[5]

    # print(heure, minute, seconde) 
    # a simple test to watch what the programm is doing (run it, and you'll see, that this test is done tausend time per second, that why I think the problem is here.)
    drawPetAig(Gamma, Pi, Epsylon, minute, canvas_)
    drawGrdAig(Gamma, Pi, Epsylon, minute, canvas_)
    drawSecAig(Gamma, Pi, Epsylon, seconde, canvas_)
    # tk_app.after(1000, lambda: HORLOGE1(250, 250, 200))
    tk_app.after(1000, lambda: HORLOGE1(Gamma, Pi, Epsylon))

# Main Function Trigger
if __name__ == '__main__':

    tk_app = Tk()
    canvas_ = Canvas(tk_app, bg="white", height=CLOCK_H, width=CLOCK_W)
    canvas_.pack()

    # HORLOGE1(250, 250, 200)
    HORLOGE1(CLOCK_CX, CLOCK_CY, CLOCK_R)

    tk_app.mainloop()
    tk_app.destroy()