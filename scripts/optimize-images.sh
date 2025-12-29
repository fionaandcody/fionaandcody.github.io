#!/bin/bash

# Define the maximum width
MAX_WIDTH=1920

# Directory to search (public/images)
# We look for jpg, jpeg, png, JPG, JPEG, PNG
SEARCH_DIR="public/images"

echo "Running image optimization check..."

# Find images
find "$SEARCH_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.JPG" -o -name "*.JPEG" -o -name "*.PNG" \) | while read -r FILE; do
    # Get image width using sips
    WIDTH=$(sips -g pixelWidth "$FILE" | grep pixelWidth | awk '{print $2}')
    
    # Check if we got a width (sips can sometimes fail on bad files)
    if [ ! -z "$WIDTH" ]; then
        if [ "$WIDTH" -gt "$MAX_WIDTH" ]; then
            echo "Resizing $FILE (Width: $WIDTH px -> $MAX_WIDTH px)"
            sips -Z "$MAX_WIDTH" "$FILE" > /dev/null
            
            # Re-add the file to git so the resized version is committed
            git add "$FILE"
        fi
    fi
done

echo "Image optimization complete."
