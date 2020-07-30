import 'package:flutter/material.dart';
import 'package:pls/theme/design_constants.dart';

class MainLayout extends StatelessWidget {
  final Widget mainHeader;
  final Widget secondaryHeader;
  final Widget items;

  const MainLayout({
    Key key,
    this.mainHeader = const Placeholder(
      fallbackHeight: 140,
    ),
    this.secondaryHeader = const Placeholder(
      fallbackHeight: 190,
    ),
    this.items = const Placeholder(),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: DesignConstants.backgroundColor,
      child: Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          mainHeader,
          secondaryHeader,
          Expanded(
            child: items,
          ),
        ],
      ),
    );
  }
}
