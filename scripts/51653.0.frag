// Этот юмор поймёт только русский!

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec2 ch_size  = vec2(0.9, 2.0);              
const vec2 ch_space = ch_size + vec2(0.7, 1.0);    
const vec2 ch_start = vec2 (-8.8, 3.0); 			
      vec2 ch_pos   = vec2 (0., 0.); 
float d = 1e6;


float dseg(vec2 p0, vec2 p1, vec2 uv)
{
vec2 dir = normalize(p1 - p0);
vec2 cp = (uv - ch_pos - p0) * mat2(dir.x, dir.y,-dir.y, dir.x);
return distance(cp, clamp(cp, vec2(0), vec2(distance(p0, p1), 0)));   
}

bool bit(int n, int b)
{
return mod(floor(float(n) / exp2(floor(float(b)))), 2.0) != 0.0;
}

void ddigit(int n, vec2 uv)
{
float v = 1e6;	
vec2 cp = uv - ch_pos;
if (n == 0)     v = min(v, dseg(vec2(-0.505, -1.000), vec2(-0.500, -1.000), uv));
if (bit(n,  0)) v = min(v, dseg(vec2( 0.500,  0.063), vec2( 0.500,  0.937), uv));
if (bit(n,  1)) v = min(v, dseg(vec2( 0.438,  1.000), vec2( 0.063,  1.000), uv));
if (bit(n,  2)) v = min(v, dseg(vec2(-0.063,  1.000), vec2(-0.438,  1.000), uv));
if (bit(n,  3)) v = min(v, dseg(vec2(-0.500,  0.937), vec2(-0.500,  0.062), uv));
if (bit(n,  4)) v = min(v, dseg(vec2(-0.500, -0.063), vec2(-0.500, -0.938), uv));
if (bit(n,  5)) v = min(v, dseg(vec2(-0.438, -1.000), vec2(-0.063, -1.000), uv));
if (bit(n,  6)) v = min(v, dseg(vec2( 0.063, -1.000), vec2( 0.438, -1.000), uv));
if (bit(n,  7)) v = min(v, dseg(vec2( 0.500, -0.938), vec2( 0.500, -0.063), uv));
if (bit(n,  8)) v = min(v, dseg(vec2( 0.063,  0.000), vec2( 0.438, -0.000), uv));
if (bit(n,  9)) v = min(v, dseg(vec2( 0.063,  0.063), vec2( 0.438,  0.938), uv));
if (bit(n, 10)) v = min(v, dseg(vec2( 0.000,  0.063), vec2( 0.000,  0.937), uv));
if (bit(n, 11)) v = min(v, dseg(vec2(-0.063,  0.063), vec2(-0.438,  0.938), uv));
if (bit(n, 12)) v = min(v, dseg(vec2(-0.438,  0.000), vec2(-0.063, -0.000), uv));
if (bit(n, 13)) v = min(v, dseg(vec2(-0.063, -0.063), vec2(-0.438, -0.938), uv));
if (bit(n, 14)) v = min(v, dseg(vec2( 0.000, -0.938), vec2( 0.000, -0.063), uv));
if (bit(n, 15)) v = min(v, dseg(vec2( 0.063, -0.063), vec2( 0.438, -0.938), uv));
ch_pos.x += ch_space.x;
d = min(d, v);
}

void main( void ) 
{
vec2 texcoord = gl_FragCoord.xy / resolution.xy;
vec2 uv = texcoord - vec2(0.5);
uv *= 25.0; 	

ch_pos = ch_start-vec2(2,3);
ch_pos.x-=0.5;ddigit(0x4281,uv);ch_pos.x+=0.1;
ddigit(0xEE00,uv);
ch_pos.x-=0.5;ddigit(0x8300,uv);ch_pos+=vec2(.5-ch_space.x,2.5);ddigit(0x0,uv); ch_pos.x+=.5-ch_space.x; ddigit(0x0,uv); ch_pos-=vec2(1.,2.5);
ddigit(0x44F9,uv);ch_pos.x+=0.1;
ch_pos.x-=0.5;ddigit(0xC440,uv);
ch_pos.x += ch_space.x/2.;
ddigit(0x50F7,uv);
ch_pos.x += ch_space.x/2.;
ch_pos.x-=0.5;ddigit(0x4381,uv);ch_pos.x+=0.1;
ch_pos.x-=0.5;ddigit(0x8242,uv);
ddigit(0,uv);ch_pos.x -= ch_space.x/2.;
ch_pos.x-=0.5;ddigit(0x8300,uv);
ch_pos.x-=0.5;ddigit(0x8200,uv);
ddigit(0x0A99,uv);ch_pos.x+=0.1;
ch_pos.x-=0.5;ddigit(0xC440,uv);
ddigit(0,uv);ch_pos.x -= ch_space.x/2.;
ddigit(0x4478,uv);ch_pos+=vec2(.5-ch_space.x,-1.);ddigit(0x2000,uv);ch_pos-=vec2(.5,-1.);
ch_pos.x-=0.5;ddigit(0x4381,uv);ch_pos.x+=0.1;
ch_pos.x-=0.5;ddigit(0x4602,uv);
ch_pos.x-=0.5;ddigit(0xC440,uv);
    
vec3 color = mix(vec3(1.,1.,0.), vec3(0.,0.,.5), smoothstep(0., 0., d) - (.1 / d));

gl_FragColor = vec4(color, 1.0);
}