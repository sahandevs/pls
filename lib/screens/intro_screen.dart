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
  final TextEditingController nameController = TextEditingController();
  final ValueNotifier<bool> isInFinalState = ValueNotifier(false);

  Widget buildFirstStep() {
    return Column(
      children: [
        Text(
          "Hi! do you mind telling me your name?",
          style: TextStyle(
            fontWeight: FontWeight.w100,
            fontSize: 28,
            color: DesignConstants.textDefaultColor,
          ),
        ),
        IntroTextInput(
          controller: nameController,
        ),
      ],
    );
  }

  Widget buildFinalStep() {
    return Column(
      children: [
        RichText(
          text: TextSpan(
            style: TextStyle(
              fontWeight: FontWeight.w100,
              fontSize: 28,
              color: DesignConstants.textDefaultColor,
            ),
            children: [
              TextSpan(text: "Nice to meet you "),
              TextSpan(
                text: nameController.text,
                style: TextStyle(
                  color: DesignConstants.textFocusColor,
                ),
              ),
              TextSpan(text: "!\nLet's create your first currency."),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        if (isInFinalState.value) {
          isInFinalState.value = false;
          return false;
        }
        return true;
      },
      child: Scaffold(
        resizeToAvoidBottomPadding: false,
        body: IntroLayout(
          child: Padding(
            padding: const EdgeInsets.all(15.0),
            child: ValueListenableBuilder(
                valueListenable: isInFinalState,
                builder: (context, snapshot, child) {
                  return AnimatedCrossFade(
                    duration: Duration(milliseconds: 300),
                    crossFadeState: isInFinalState.value
                        ? CrossFadeState.showSecond
                        : CrossFadeState.showFirst,
                    firstChild: buildFirstStep(),
                    secondChild: buildFinalStep(),
                    firstCurve: Curves.easeInOut,
                    secondCurve: Curves.easeInOut,
                  );
                }),
          ),
          action: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 15),
            child: ValueListenableBuilder(
              valueListenable: nameController,
              builder: (context, snapshot, child) => AnimatedOpacity(
                duration: Duration(milliseconds: 500),
                curve: Curves.easeInOut,
                opacity: nameController.text.trim().isEmpty ? 0 : 1,
                child: child,
              ),
              child: AppButton(
                child: Text("Ok"),
                onPress: () {
                  if (!isInFinalState.value) {
                    isInFinalState.value = true;
                    FocusScope.of(context).unfocus();
                  }
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
