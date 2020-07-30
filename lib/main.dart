import 'package:flutter/material.dart';
import 'package:pls/layouts/main_layout.dart';
import 'package:pls/screens/intro_screen.dart';

import 'layouts/intro_layout.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'pls',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        fontFamily: 'Roboto',
      ),
      home: IntroScreen(),
    );
  }
}
