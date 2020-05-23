* CTRL + SHIFT + N：指定要创建的终端
* Settings
* Search in page
* only CTRL + INS copies text currently
* exe icon
* 托盘
* 多page切换后shellpanel没有resize

## 20/5/23 - Takt1

### Background Items

#### 1.Support Keybindings Configuration

For now, terminal's keybindings are built with hard code.
We should provide interactive way for user to customize keybindings.

#### 2.Optimize window resize listener

For now, PanelManager responds to listen window resize event and trigger panel contents to do resize.

We should implement a kind of event mechanism, not direct call.

#### 3.Optimize divider dragging

For now, the divider dragging starts as mouse moving, stops when mouse up.