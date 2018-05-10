import UIKit
@objc(RNPhotoBrowser)
class RNPhotoBrowser: NSObject{
  @objc(show:callback:)
  func show(msg:String!, callback: RCTResponseSenderBlock) -> Void {
    callback(["sfsdfsdfsdfsdfsdfsdfsdfds:\(msg)"])
  }
  
  func getRootVC() -> UIViewController {
    let root: UIViewController = (UIApplication.shared.delegate?.window!!.rootViewController)!
    return root
  }
}
