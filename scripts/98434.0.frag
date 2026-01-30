#version 330

uniform float u_time;  // input parameter: the current time

void main() {
  float t = u_time;  // assign the current time to a local variable

  // Calculate the x and y positions of the fragment based on the time
  float x = cos(t);
  float y = sin(t);

  // Set the fragment color based on the x and y positions
  gl_FragColor = vec4(x, y, 0.0, 1.0);
}


}