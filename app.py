import overpy
from flask import Flask, render_template, jsonify, request
import threading
import time
import webbrowser
import requests
import os

app = Flask(__name__, static_folder='static')

# Function to fetch nearby restaurants
def get_restaurants(lat, lon, type_filter=None):
    api = overpy.Overpass()
    query = f"""
    node
      ["amenity"~"restaurant|fast_food"]
      ({lat - 0.02},{lon - 0.02},{lat + 0.02},{lon + 0.02});
    out;
    """
    result = api.query(query)

    restaurants = [{
        "name": node.tags.get("name", "Unnamed Restaurant"), 
        "lat": node.lat, 
        "lon": node.lon,
        "type": node.tags.get("amenity", "unknown")  # Store restaurant type!
    } for node in result.nodes]

    if type_filter:
        restaurants = [r for r in restaurants if r["type"] == type_filter]  # Filter correctly!

    return restaurants

# API Route for fetching restaurant data
@app.route('/api/restaurants', methods=['GET'])
def fetch_restaurants():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    type_filter = request.args.get('type', default=None)  # "restaurant" or "fast_food"
    if lat is None or lon is None:
        return jsonify({"error": "Latitude and longitude are required"}), 400
    print("TYPE FILTER: " + str(type_filter), flush=True)
    restaurants = get_restaurants(lat, lon, type_filter)
    return jsonify(restaurants)


@app.route('/')
def home():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)