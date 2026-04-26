---
title: "隐私审查规则"
draft: true
---

# 隐私审查规则

发布前检查：

1. 是否包含手机号、私人邮箱、住址、身份证、银行卡。
2. 是否包含 API Key、Token、Cookie、密码和内部地址。
3. 是否包含客户、同事、朋友的真实姓名或可识别信息。
4. 是否包含未公开商业信息。
5. 是否误把私人日记或草稿设为公开。

发现风险时，把 `draft` 改为 `true`，并在文末添加：

```md
<!-- privacy-review: needs-user-confirmation -->
```
