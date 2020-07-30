import 'dart:ui';

import 'package:flutter/material.dart';

class DesignConstants {
  static Color primaryColor = const Color.fromARGB(255, 0, 201, 255);
  static Color secondaryColor = const Color.fromARGB(255, 146, 254, 157);

  static Color textDefaultColor = const Color.fromARGB(255, 172, 172, 172);
  static Color textFocusColor = Colors.black;

  static Color userInputColor = const Color.fromARGB(255, 69, 129, 115);

  static LinearGradient primaryGradient = LinearGradient(
    colors: [
      DesignConstants.secondaryColor,
      DesignConstants.primaryColor,
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static BorderRadius borderRadius = BorderRadius.circular(12);

  static BoxShadow shadow = BoxShadow(
    color: const Color.fromARGB(255, 217, 217, 217),
    blurRadius: 6,
    offset: Offset(0, 3),
  );

  static ImageFilter modalBlur = ImageFilter.blur(
    sigmaX: 30,
    sigmaY: 30,
  );

  static Color modalBackground = Color.fromARGB(100, 0, 0, 0);
  static Color backgroundColor = Colors.white;

}
