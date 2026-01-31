#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}


uniform vec2 iResolution;  // Define the resolution of the output image
uniform sampler2D iChannel0;  // Define the input texture

uniform vec3 projectorpos;
uniform vec3 mirrorpos;

/*
   Spherical mirror glsl shader
*/

float mirrorradius = 0.339;
float domeradius = 1.5;
int domeflip = -1; 
float xycut = 0.0;
float yzcut = 10.0;

float projectortilty = 1.0;          // y axis tilt of projector
float dometilty = 90.0;               // y axis tilt of dome
int backfade = 0;                    // The fading mode

float projectorthrow = 2.03;          // Distance / width
float projectorvoffset = -0.104;        // Vertical lens shift
int projectordir = -1;                // Whether the projector points along +x axis or -x axis

vec3 pviewer = vec3(0.0,0.0,0.0);              // Position of the viewer

vec3 RotateX(vec3 p,float angle)
{
   vec3 q;
   q.x =  p.x;
   q.y =  p.y * cos(angle) + p.z * sin(angle);
   q.z = -p.y * sin(angle) + p.z * cos(angle);
   return q;
}

vec3 RotateY(vec3 p,float angle)
{
   vec3 q;
   q.x =  p.x * cos(angle) + p.z * sin(angle);
   q.y =  p.y;
   q.z = -p.x * sin(angle) + p.z * cos(angle);                       
   return q;
}

vec3 RotateZ(vec3 p,float angle)
{
   vec3 q;
   q.x =  p.x * cos(angle) + p.y * sin(angle);
   q.y = -p.x * sin(angle) + p.y * cos(angle);
   q.z =  p.z;
   return q;
}

/*
   Calculate the intersection of a ray and a sphere
   The line segment is defined from p1 to p2
   The sphere is of radius r and centered at sc
   There are potentially two points of intersection given by
   p = p1 + mu1 (p2 - p1)
   p = p1 + mu2 (p2 - p1)
   Return (-1000) if the ray doesn't intersect the sphere.
*/
float RaySphereIntersect(vec3 p1,vec3 p2,vec3 sc,float r,int m)
{
   float a,b,c,bb4ac;
   vec3 dp;
   float eps = 0.0001;
   float mu1,mu2;

   dp = p2 - p1;
   //a = dp.x * dp.x + dp.y * dp.y + dp.z * dp.z;
   a = dot(dp,dp);
   //b = 2.0 * (dp.x * (p1.x - sc.x) + dp.y * (p1.y - sc.y) + dp.z * (p1.z - sc.z));
   b = 2.0 * dot(dp,p1 - sc);
   //c = sc.x * sc.x + sc.y * sc.y + sc.z * sc.z;
   //c += p1.x * p1.x + p1.y * p1.y + p1.z * p1.z;
   //c -= 2.0 * (sc.x * p1.x + sc.y * p1.y + sc.z * p1.z);
   //c -= r * r;
   c = dot(sc,sc) + dot (p1,p1) - 2.0 * dot(sc,p1) - r*r;
   bb4ac = b * b - 4.0 * a * c;
   if ((a > -eps && a < eps) || bb4ac < 0.0)
      return(-1000.0);

   mu1 = (-b + sqrt(bb4ac)) / (2.0 * a);
   mu2 = (-b - sqrt(bb4ac)) / (2.0 * a);
   
   if (m == 2)
      return(max(mu1,mu2));   // Dome case
   else
      return(min(mu1,mu2));   // Mirror case
}

/*
   Right hand coordinate system. Origin at the center of the dome.
   Projector FOV is measured across the width of the projected image
*/

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

   // Input texture coordinates
   vec2 p = (-iResolution.xy + 2.0 * fragCoord) / iResolution.y;

   vec2 pfish,uv;
   float br=1.0;
   float dh,dv,mu,phi,r,theta;
   vec3 p0,p1,p2,pn,ray,origin=vec3(0.0,0.0,0.0),pdome;
   vec4 black = vec4(0.0,0.0,0.0,1.0);
   float pi = 3.141592653589793;
   vec4 red = vec4(1.0,0.0,0.0,1.0);
   vec4 blue = vec4(0.0,0.0,1.0,1.0);

   // Angles to radians
   projectortilty = radians(projectortilty);
   dometilty = radians(dometilty);

   // Perspective projection plane width and height
   dh = 0.5 / projectorthrow;                    // Horizontal half width
   dv = iResolution.y * dh / iResolution.x;      // Vertical half width

   // Vector p in perspective frustum in normalised coordinates
   uv.x = 2.0 * fragCoord.x / iResolution.x - 1.0;            // -1 ... 1
   uv.y = 2.0 * fragCoord.y / iResolution.y - 1.0;            // -1 ... 1
   p0.x = float(projectordir);
   p0.y = uv.x * dh;
   p0.z = (uv.y + projectorvoffset) * dv;
   
   // Deal with projector tilt, y axis only
   p0 = RotateY(p0,projectortilty);
   p0 = normalize(p0);
   
   // Find the intersection point of ray with the spherical mirror
   ray = projectorpos + p0;
   mu = RaySphereIntersect(projectorpos,ray,mirrorpos,mirrorradius,1);
   if (mu < 0.0) {
      fragColor = black;
      return;
   }
   p1 = projectorpos + mu * p0;

   // Calculate the reflected ray
   pn = normalize(p1 - mirrorpos);
   p2 = p0 - 2.0 * dot(p0,pn) * pn;

   // Determine intersection with dome
   ray = p1 + p2;
   mu = RaySphereIntersect(p1,ray,origin,domeradius,2);
   if (mu < 0.0) {
      fragColor = black;
      return;
   }
   pdome = p1 + mu * p2;
  
   // Deal with dome orientation, y axis only
   pdome = RotateY(pdome,-dometilty);
   pdome.x *= float(domeflip);

   // Adjust viewer position but moving dome relative to viewer
   pdome -= pviewer;

   // Cutting plane
   if (pdome.z < xycut) {
      fragColor = black;
      return;
   }
   if (pdome.x > yzcut) {
      fragColor = black;
      return;
   }

   // Find u,v coordinates in fisheye image
   phi = atan(sqrt(pdome.x*pdome.x+pdome.y*pdome.y),pdome.z); // 0 ... pi/2
   r = 2.0 * phi / pi;  
   if (r > 1.0) {                                             // Assumes 180 degree dome
      fragColor = black;
      return;
   }
   theta = atan(pdome.x,pdome.y);                             // -pi ... pi
   pfish.x = 0.5 * (1.0 + r * cos(theta));
   pfish.y = 0.5 * (1.0 + r * sin(theta));
   if (pfish.x < 0.0 || pfish.y < 0.0 || pfish.x > 1.0 || pfish.y > 1.0) {
      fragColor = black;
      return;
   }

   // After calculating pfish coordinates
   // printf("pfish: %f %f\n", pfish.x, pfish.y);

   // After calculating pfish coordinates
   // Outputting values to the color buffer
   fragColor = vec4(pfish.x, pfish.y, 0.0, 1.0);


   // Get the pixel colour
   //fragColor = texture(iChannel0,pfish);
   
   // Back fading
   if (backfade == 1) {
      br = (pdome.x - domeradius) / (-domeradius/16.0);
   } else if (backfade == 2) {
      br = (pdome.x - 0.95*domeradius) / (-domeradius/16.0);
   } else if (backfade == 3) {
      br = (pdome.x - 0.9*domeradius) / (-domeradius/16.0);
   } else if (backfade == 4) {
      br = (pdome.x - domeradius) / (-domeradius/8.0);
   } else if (backfade == 5) {
      br = (pdome.x - 0.95*domeradius) / (-domeradius/8.0);
   } else if (backfade == 6) {
      br = (pdome.x - 0.9*domeradius) / (-domeradius/8.0);
   } else if (backfade == 7) {
      br = (pdome.x - domeradius) / (-domeradius/4.0);
   } else if (backfade == 8) {
      br = (pdome.x - 0.95*domeradius) / (-domeradius/4.0);
   } else if (backfade == 9) {
      br = (pdome.x - 0.9*domeradius) / (-domeradius/4.0);
   }
   if (br < 0.0) br = 0.0;
   if (br > 1.0) br = 1.0;
   fragColor.r *= br;
   fragColor.g *= br;
   fragColor.b *= br;
      
   return;

   // Inside mainImage function
   // printf("projectorpos: %f %f %f\n", projectorpos.x, projectorpos.y, projectorpos.z);
   // printf("mirrorpos: %f %f %f\n", mirrorpos.x, mirrorpos.y, mirrorpos.z);

}

//out vec4 fragColor;  // Define the output variable here

//void main()
//{
  //  vec2 fragCoord = gl_FragCoord.xy;
   // vec4 fragColor;
   // mainImage(fragColor, fragCoord);
//}