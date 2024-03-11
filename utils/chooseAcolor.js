export default function choseAColor() {
  const randomNumber = Math.floor(Math.random() * 16);

  const pastelColors = [
    'rgb(255, 235, 205)', // Peach
    'rgb(152, 251, 152)', // Light Green
    'rgb(173, 216, 230)', // Light Blue
    'rgb(244, 164, 96)', // Sandy Brown
    'rgb(240, 255, 240)', // Honeydew
    'rgb(240, 230, 140)', // Khaki
    'rgb(173, 255, 47)', // Green Yellow
    'rgb(240, 248, 255)', // Alice Blue
    'rgb(255, 228, 196)', // Bisque
    'rgb(245, 222, 179)', // Wheat
    'rgb(255, 250, 205)', // Lemon Chiffon
    'rgb(255, 228, 225)', // Misty Rose
    'rgb(244, 240, 240)', // Lavender Blush
    'rgb(240, 255, 255)', // Azure
    'rgb(240, 128, 128)', // Light Coral
  ];

  return pastelColors[randomNumber];
}
