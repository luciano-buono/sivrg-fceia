https://www.reddit.com/r/OrangePI/comments/15vtbs5/rc522_rfid_gpio_connected_to_orangepi5plus/

First, have you followed the instructions and do you get /dev/spidev0.0 now ?? You need it.

If so, let's stay with the library from your link, but installing it from https://github.com/pimylifeup/MFRC522-python after a few modifications. The problem is that it relies somewhat on GPIO (using this library, with some specific RPi commands : https://sourceforge.net/p/raspberry-gpio-python/wiki/BasicUsage/ )

While Orange Pi has a mostly similar WiringOP python library with slightly different import, functions and constants names, these could be easily modified to achieve the same results, provided that you understand the basics of pin modes and states... BUT this is not absolutely needed to use the RC522 (power and SPI lines are enough), so you can just remove them from the library.

First, if you already installed it, remove the mfrc522 library ( sudo pip3 uninstall mfrc522 ) then you can clone the Github, and delete those lines dealing with GPIO in file mfrc522/MFRC522.py : line 23, 167, and the whole section from 138 to 152 . Also remove line 4 in mfrc522/SimpleMFRC522.py.

Their sole purpose is only to keep the RST line always driven to level "high", which is totally useless since the module board already holds it high physically with a pull-up resistor ! So, you can follow all the wiring detailed in the related blog post, except for this unnecessary wire to RST, just leave it unconnected for now (if needed, you could set it to low level to reset the module, just manually connecting it yourself briefly to ground, or later doing the same with a GPIO output, see WiringOP-Python installation and one-line python examples in the OPI5+ online manual, or this : https://github.com/orangepi-xunlong/wiringOP-Python/blob/master/examples/blink.py)

Lastly (once you have previously installed its required dependency : sudo pip3 install spidev ), you'll also need to delete line 17 in setup.py before installing the library with python setup.py install . Then you should be able run the "Example Code", once you remove its (useless) "GPIO.cleanup()" line, of course.