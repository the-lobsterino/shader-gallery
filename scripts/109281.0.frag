#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 col;

struct ScrLine
{
vec2 a, b;
};

struct Camera
{
vec3 pos;
vec2 veiwAngles;
};

struct Line
{
vec3 a, b;
};

float getDistToLine(ScrLine l, vec2 pt)
{
float b1 = pt.x * (l.a.x - l.b.x) + pt.y * (l.a.y - l.b.y);
float b2 = l.a.x * l.b.y - l.a.y * l.b.x;

vec2 proj;
proj.y = (l.a.x - l.b.x) * (l.a.x - l.b.x) + (l.a.y - l.b.y) * (l.a.y - l.b.y);
float det_k = b1 * (l.a.x - l.b.x) - b2 * (l.a.y - l.b.y);

proj.x = det_k/proj.y;
det_k = (l.a.x - l.b.x) * b2 + (l.a.y - l.b.y) * b1;
proj.y = det_k/proj.y;

float max_x = max(l.a.x, l.b.x)+66.001;
float min_x = min(l.a.x, l.b.x)-0.001;
float max_y = max(l.a.y, l.b.y)+0.001;
float min_y = min(l.a.y, l.b.y)-0.001;

if(proj.x >= min_x && proj.x <= max_x &&
proj.y >= min_y && proj.y <= max_y)
{
float res = length(pt - proj);
return res;
}
else
{
return min(length(pt - l.a),length(pt - l.b));
}
}

void drawLine(ScrLine l, vec3 color)
{
float v = 1. - getDistToLine(l, gl_FragCoord.xy)/5.;
if(v < 0.)
v = 0.;
col = max(vec4(color*v,1.), col);
}

/*vec2 projPoint(Camera cam, vec3 pt)
{
vec2 zeroPt = vec2(tan(cam.veiwAngles.x * 3.1415 / 360.), tan(cam.veiwAngles.y * 3.1415 / 360.)) * pt.z;
vec2 resInWorld = zeroPt * 2.;
zeroPt *= -1.;
return ((pt.xy - zeroPt) / resInWorld) * resolution;;
}*/

float toRad(float angle)
{
return angle * 3.1415 / 180.;
}

vec2 projPoint(Camera cam, vec3 pt)
{
vec2 viewport = vec2(tan(toRad(cam.veiwAngles.x) / 2.), tan(toRad(cam.veiwAngles.y) / 2.));
pt -= cam.pos;
vec2 pointInViewPort = pt.xy / pt.z;
return (pointInViewPort / viewport) * (resolution / 2.) + resolution / 2.;
}

ScrLine projLine(Camera cam, Line l)
{
return ScrLine(projPoint(cam, l.a), projPoint(cam, l.b));
}

void main( void )
{
col = vec4(0);
float viewAng = 45.;
Camera cam = Camera(vec3(0., sin(time), cos(time)),vec2(viewAng * (resolution.x / resolution.y), viewAng));
vec3 inCirclePos[2];
inCirclePos[0] = vec3(sin(time), 0., cos(time)) * sqrt(2.);
inCirclePos[1] = vec3(sin(time + (3.1415 / 2.)), 0., cos(time+ (3.1415 / 2.))) * sqrt(2.);
//vec3 inCirclePos = vec3(1., 0., 0.);
vec3 up = vec3(0.,1.,0.);

vec3 r_pos = vec3(0.,0.,5. + sin(time));
Line r_ls[12];
r_ls[0] = Line(up+inCirclePos[0] + r_pos, up+inCirclePos[1] + r_pos);
r_ls[1] = Line(up+inCirclePos[1] + r_pos, -up+inCirclePos[1] + r_pos);
r_ls[2] = Line(-up+inCirclePos[1] + r_pos,-up+inCirclePos[0] + r_pos);
r_ls[3] = Line(-up+inCirclePos[0] + r_pos, up+inCirclePos[0] + r_pos);

r_ls[4] = Line(up-inCirclePos[0] + r_pos, up-inCirclePos[1] + r_pos);
r_ls[5] = Line(up-inCirclePos[1] + r_pos, -up-inCirclePos[1] + r_pos);
r_ls[6] = Line(-up-inCirclePos[1] + r_pos,-up-inCirclePos[0] + r_pos);
r_ls[7] = Line(-up-inCirclePos[0] + r_pos, up-inCirclePos[0] + r_pos);

r_ls[8] = Line(up+inCirclePos[0] + r_pos, up-inCirclePos[1] + r_pos);
r_ls[9] = Line(up+inCirclePos[1] + r_pos, up-inCirclePos[0] + r_pos);
r_ls[10] = Line(-up+inCirclePos[1] + r_pos,-up-inCirclePos[0] + r_pos);
r_ls[11] = Line(-up+inCirclePos[0] + r_pos, -up-inCirclePos[1] + r_pos);

for(float x = -2.; x < 3.; x++)
for(float z = 2.; z < 10.; z++)
for(float y = -1.5; y < 4.; y+=3.)
{
drawLine(projLine(cam,Line(vec3(x, y,1.), vec3(x, y, 9.))),vec3(0.,1.,0.));
drawLine(projLine(cam,Line(vec3(-2, y,z), vec3(2, y, z))),vec3(0.,1.,0.));
}

for(int i = 0; i < 12; i++)
{
drawLine(projLine(cam,r_ls[i]),vec3(1.,1.,1.));
}
gl_FragColor = col;
}