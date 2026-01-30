uniform mat4 transform;
uniform vec4 color;
uniform float sliceIndex;
uniform float resolutionX;
uniform float resolutionY;
uniform float resolutionZ;

out vec4 fragColor;

void main(){

vec4 pixel = vec4( gl_FragCoord.x / resolutionX, gl_FragCoord.y / resolutionY, sliceIndex / resolutionZ, 1);
pixel = transform * pixel;
float x = pixel.x;
float y = pixel.y;
float z = pixel.z;
vec3 p = vec3(x, y, z);

// Lattice definition
//parameters
float param1= 1;
float param2= 1.2;
float minSize= int(round(50 + (1+x) *100));
float maxSize= 1000- minSize;
float dx= mod(int((1+x) * param2),1000);
float dy= mod(int((1+y) * param2),1000);
float dz= mod(int((1+z) * param2),1000);
//parameters
float structureTest =float( distance > param1 ||((dx < minSize || dx > maxSize) && (dy < minSize || dy > maxSize)) ||  ((dy < minSize || dy > maxSize) && (dz < minSize || dz > maxSize)) || ((dx < minSize || dx > maxSize) && (dz < minSize || dz > maxSize)));
// Geometry definition
float geometryTest = float(((x < 1.0 && x >= 0.0) && (y < 1.0 && y >= 0.0) && (z < 1.0 && z >= 0.0)));
float test = geometryTest * structureTest;
fragColor = color * vec4(test, test, test, test);

}