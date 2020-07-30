import 'package:flutter/material.dart';
import 'package:pls/theme/design_constants.dart';

class AppButton extends StatefulWidget {
  final Widget child;
  final VoidCallback onPress;

  const AppButton({Key key, this.child, this.onPress}) : super(key: key);

  @override
  _AppButtonState createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton> {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [DesignConstants.shadow],
        borderRadius: DesignConstants.borderRadius,
        color: DesignConstants.backgroundColor,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: widget.onPress,
          customBorder: RoundedRectangleBorder(
            borderRadius: DesignConstants.borderRadius,
          ),
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: 25,
              vertical: 5,
            ),
            child: DefaultTextStyle(
              style: TextStyle(color: DesignConstants.textDefaultColor),
              child: widget.child,
            ),
          ),
        ),
      ),
    );
  }
}
