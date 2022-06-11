# aws-connect-billing-metrics
# DISCLAIMER: aws-connect-billing-metrics is not affiliated with Amazon or any of it's subsidiaries. Use at your own risk.

From [Amazon Connect pricing Docs](https://www.google.com/aclk?sa=L&ai=DChcSEwiQhprt66X4AhUQ7u0KHT9wC24YABABGgJkZw&sig=AOD64_0gFq9YFh6JK-cTnJakkdLXMPYzuA&ved=2ahUKEwi_jZTt66X4AhVPi1wKHZFmBWYQqyQoAHoECAIQBQ&adurl=)

> For telephony charges, Amazon Connect offers direct inward dial (DID) and toll-free phone numbers in more than 20 countries worldwide, which are charged on a per-day rate. Inbound calls are **charged per-second (minimum 60s)**. There are also 200+ outbound calling destinations available that charge per-second (minimum 60s) for each interaction. To check for country-specific pricing, refer to the tables below. Taxes, surcharges, and fees may apply.

When placing a call( e.g. customer inbound call) and the call duration is less then 60s(say 50s), 
the call duration will be stored as its actual value(50s) in the CTR/metrics.
But since Amazon Connect charges a minimum of 60s, the actual value(minutes) will be 60sec in the Amazon Billing Dashboard. 
Therefore, this program tries to calculate the difference in minutes(Metrics vs Billing).


#### For example dddd

Suppose I receive the following inbound calls to my contact center:

1. contactId: aaa, name: customer A, duration: 40s
2. contactId: bbb, name: customer B, duration: 50s
3. contactId: ccc, name: customer C, duration: 26s

The metrics will contain the following minutes: 40s + 50s + 26s = 116s

But since Amazon Connect charges minimum(60s), the billing dashboard show the following minutes: 60s + 60s + 60s = 180s

Given the CTRs, this program tries to calculate the difference(180 - 116 = 64sec)

