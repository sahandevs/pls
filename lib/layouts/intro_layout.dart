import 'package:flutter/material.dart';
import 'package:pls/Theme/design_constants.dart';

class IntroLayout extends StatelessWidget {
  final Widget child;
  final Widget action;

  const IntroLayout({
    Key key,
    this.action = const Placeholder(
      fallbackHeight: 50,
      fallbackWidth: 100,
    ),
    this.child = const Placeholder(
      fallbackHeight: 250,
      fallbackWidth: double.infinity,
    ),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    final keyboardPaddingSize = mq.viewInsets.bottom;
    return AnimatedContainer(
      duration: Duration(milliseconds: 700),
      curve: Curves.easeInOut,
      padding: EdgeInsets.only(bottom: keyboardPaddingSize / 3),
      color: DesignConstants.backgroundColor,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            child,
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              mainAxisSize: MainAxisSize.max,
              children: [action],
            )
          ],
        ),
      ),
    );
  }
}
