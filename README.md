# WheelOfFortune
Simple game. Spend coins to spin the wheel, spin the wheel to get coins.

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
