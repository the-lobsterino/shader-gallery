
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

vec3 castRay(vec3 origin, vec3 direction) {
    //float sphere_size = sin(time)*5.0 + 7.5;
    float sphere_size = 1.0*5.0 + 7.5;
    float grid_size = 1.0;
    vec3 centerOfSphere = vec3(0, 0, 0);
    float sign_x = direction.x > 0.0 ? 1.0 : -1.0;
    float sign_y = direction.y > 0.0 ? 1.0 : -1.0;
    float sign_z = direction.z > 0.0 ? 1.0 : -1.0;
    float offset_x = direction.x > 0.0 ? 0.0 : 1.0;
    float offset_y = direction.y > 0.0 ? 0.0 : 1.0;
    float offset_z = direction.z > 0.0 ? 0.0 : 1.0;
    const int max_steps = 100;

    vec3 pos = origin;
    vec3 tile_coords = (floor(pos)/grid_size); // Possible errors here?

    float dist = distance(tile_coords, centerOfSphere);
    int step = 0;

    int lastdir = -1;
    for (int i = 0; i < max_steps; i++) {
        step++;
        float dtx = ((tile_coords.x + (sign_x + offset_x)*grid_size) - pos.x) / direction.x; // These lines could produce misalignment issues, but so far have not seen any problems
        float dty = ((tile_coords.y + (sign_y + offset_y)*grid_size) - pos.y) / direction.y;
        float dtz = ((tile_coords.z + (sign_z + offset_z)*grid_size) - pos.z) / direction.z;
	
        if (dtx < dty && dtx < dtz) {
            pos += direction*dtx;
            tile_coords.x += sign_x*grid_size;
            lastdir = 0;
        }
        else if (dty < dtz) {
            pos += direction*dty;
            tile_coords.y += sign_y*grid_size;
            lastdir = 1;
        }
        else {
            pos += direction*dtz;
            tile_coords.z += sign_z*grid_size;
            lastdir = 2;
        }
	
        dist = distance(abs(tile_coords), centerOfSphere);
	if (dist < sphere_size) break;
    }
    // Get the color of the pixel depending on which direction the last step was taken in.
    vec3 color;
    if (step == max_steps) color = vec3(0,0,0);
    else if (lastdir == 0) color = vec3(255,0,0);
    else if (lastdir == 1) color = vec3(0,255,0);
    else color = vec3(0,0,255);
    return color;
}

mat4 LookAt(vec3 eye, vec3 at, vec3 up)
{
  vec3 zaxis = normalize(at - eye);    
  vec3 xaxis = normalize(cross(zaxis, up));
  vec3 yaxis = cross(xaxis, zaxis);

  zaxis *= -1.0;

  mat4 viewMatrix = mat4(
    vec4(xaxis.x, xaxis.y, xaxis.z, -dot(xaxis, eye)),
    vec4(yaxis.x, yaxis.y, yaxis.z, -dot(yaxis, eye)),
    vec4(zaxis.x, zaxis.y, zaxis.z, -dot(zaxis, eye)),
    vec4(0, 0, 0, 1)
  );

  return viewMatrix;
}
void main()
{
    vec3 origin = vec3 (sin(mouse.x*7.0), (mouse.y-0.5)*2.0, cos(mouse.x*7.0));
    origin = normalize(origin) * 40.0;

    vec2 position = ( gl_FragCoord.xy - resolution/2.0) * 2.0;
    vec3 direction = normalize(vec3(position, resolution.x));

    mat4 lookAt = LookAt(origin, vec3(0, 0, 0), vec3(0, 1.0, 0));
    vec4 dir  = lookAt*vec4(direction, 1);
    dir /= dir.w;
    direction = dir.xyz;
    direction += 0.00001;


    vec3 color = castRay(origin, direction);

    gl_FragColor = vec4(color, 1.0);
}

