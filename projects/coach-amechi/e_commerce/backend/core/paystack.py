from django.conf import settings
import requests

class Paystack:
	def __init__(self):
		# secret_key = settings.PAYSTACK_SECRET_KEY
		self.base_url = "https://api.paystack.co/transaction"
		self.headers = {
			"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
			"Content-Type": "application/json",
		}
		return

	def initialize_transaction(self, customer_email:str, amount:float):
		url = f"{self.base_url}/initialize"
		payload = {
			"amount": f"{round(amount, 2) * 100}",
			"email": customer_email,
			"channels": ["card", "ussd", "bank_transfer"],
			"currency": "NGN"
		}
		try:
			response = requests.post(url=url, headers=self.headers, json=payload)
			response.raise_for_status()
			return response.json()
		except Exception:
			# log the exceptions

			return {
				"status": False,
				"message": "Initialise Transaction Failed"
			}
	
	def verify_transaction(self, ref_code):
		url = f"{self.base_url}/verify/{ref_code}"

		try:
			response = requests.get(url=url, headers=self.headers)
			response.raise_for_status()
			return response.json()
		except Exception:
			# log the exception
			
			return {
				"status": False,
				"message": "Verification failed"
			}