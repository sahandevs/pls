import 'package:flutter/material.dart';
import 'package:pls/layouts/intro_layout.dart';
import 'package:pls/theme/design_constants.dart';
import 'package:pls/widgets/app_button.dart';
import 'package:pls/widgets/intro_text_input.dart';

class IntroScreen extends StatefulWidget {
  @override
  _IntroScreenState createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomPadding: false,
      body: IntroLayout(
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            children: [
              Text(
                "Hi! do you mind telling me your name?",
                style: TextStyle(
                  fontWeight: FontWeight.w100,
                  fontSize: 28,
                  color: DesignConstants.textDefaultColor,
                ),
              ),
              IntroTextInput(),
            ],
          ),
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
