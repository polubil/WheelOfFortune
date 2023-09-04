# WheelOfFortune
Simple game. Spend coins to spin the wheel, spin the wheel to get coins.
Based on Django Rest Framework, ReactJS.

# Preview

![image](https://github.com/polubil/WheelOfFortune/assets/110416709/af60dfdc-9cf3-49be-af50-748688ec1dca)

![image](https://github.com/polubil/WheelOfFortune/assets/110416709/e7cc02c0-7155-4c55-ad5d-df884df7a01f)


# Usage
1. Clone the Repo:

   ```
   git clone https://github.com/polubil/WheelOfFortune
   cd ./WheelOfFortune/
   ```

2. Create and activate venv:

   ```
   python -m venv venv
   ./venv/Scripts/activate
   ```

3. Install python requirements:

   ```
   pip install -r .\requirements.txt
   ```

4. Make migrations and migrate:

   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Run server:

   ```
   python manage.py runserver
   ```

Congratulations! Now you can visit ```http://localhost:8000/```, get registered or sign in via VK.com and enjoy!
