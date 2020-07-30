import 'package:flutter/material.dart';
import 'package:pls/theme/design_constants.dart';

class IntroTextInput extends StatefulWidget {
  @override
  _IntroTextInputState createState() => _IntroTextInputState();
}

class _IntroTextInputState extends State<IntroTextInput> {
  @override
  Widget build(BuildContext context) {
    return TextField(
      autocorrect: false,
      style: TextStyle(
        fontWeight: FontWeight.w100,
        color: DesignConstants.textFocusColor,
        fontSize: 30,
      ),
      cursorColor: DesignConstants.textFocusColor,
      cursorRadius: Radius.circular(15),
      cursorWidth: 3,
      decoration: InputDecoration(
        border: InputBorder.none,
        focusedBorder: InputBorder.none,
        enabledBorder: InputBorder.none,
        errorBorder: InputBorder.none,
        disabledBorder: InputBorder.none,
      ),
    );
  }
}
