import 'package:flutter/material.dart';
import 'package:pls/layouts/intro_layout.dart';
import 'package:pls/theme/design_constants.dart';
import 'package:pls/widgets/app_button.dart';

class IntroScreen extends StatefulWidget {
  @override
  _IntroScreenState createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IntroLayout(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(15.0),
              child: Text(
                "Hi! do you mind telling me your name?",
                style: TextStyle(
                  fontWeight: FontWeight.w100,
                  fontSize: 28,
                  color: DesignConstants.textDefaultColor,
                ),
              ),
            ),
          ],
        ),
        action: Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 15),
          child: AppButton(
            child: Text("Ok"),
            onPress: () {},
          ),
        ),
      ),
    );
  }
}
