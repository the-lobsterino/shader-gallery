#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


const float kSize = 80.0;

float K(float x, float y)
{
   float expo = (170.0 - 160.0 * exp(-500.0 * pow(x - 19.0/20.0, 4.0)))
      * (3.0 / 5.0 * (x - 1.0) * (x - 1.0) +
         14.0 * (100.0 / (100.0 - 99.0 * exp (-10.0 * (x - 23.0/20.0) * (x - 23.0/20.0))))
         * pow(abs(y - 3.0 / 5.0), 2.0 + 3.0 * (x - 3.0 / 5.0)) - 1.0 / 20.0);
  return (1.0/2.0 + 2.0 * (y - 3.0/5.0))
      * (1.0 - 3.0/10.0 * pow(sin(time + 120.0 * (y - 3.0/5.0) * exp(10.0 * (x - 1.0) * (x - 1.0))), 8.0))
      * exp(-exp(expo));
}

float Q(float s, float x, float y)
{
  return y + 3.0/5.0 * x
    + (x + 1.0) * (x + 1.0) / 10.0
    - 9.0/5.0 * (1.0 - pow(1.0 - s / 150.0, 8.0/5.0))
    + 17.0/10.0 + 3.0/10.0 * sin(s * s * s);
}

float P(float s, float x, float y)
{
  return sin(5.0 * (x
    + 1.0/5.0 * (sin(7.0 * s * s) + sin(x + s * s) - 3.0) * y
    + sin(s * s) - 2.0/25.0 * sin(5.0 * y + sin(time + 4.0 * s * s))));
}

float J(float s, float x, float y)
{
    return float(s > 0.0) * exp(
      -exp(
        50.0 * (30.0 * pow(abs(P(s, x, y)), 3.0) + (pow(Q(s, x, y), 4.0) - 3.0/5.0))
      )
    );
}

float Ur(float r, float x, float y)
{
  float prod = 1.0;
  for (float k = 0.0; k < kSize; k += 1.0)
      prod *= 1.0 - float(k < r) * J(k, x, y);
  return prod;
}

float U(float s, float x, float y)
{
    float sum = 0.0;
    for (float r = 1.0; r < kSize; r += 1.0)
    {
        float exp0 = 50.0 * pow(abs(P(r, x, y)), 3.0)
          + pow(Q(r, x, y), 4.0) - 3.0/5.0;
        float exp1 = -5.0 * (20.0 * pow(abs(P(r, x, y)), 3.0)
                    + pow(1.0 / 50.0 + Q(r, x, y), 4.0)
                            - 3.0/5.0);
        float exp3 = -1000.0 * Q(r, x, y);
      
        float s0 = 4.0 * exp(-exp(100.0 * exp0) - exp(exp1) - exp(exp3));
        float s10 = 1.0 + (2.0 - s) * (2.0 - s) / 20.0
          + 1.0/5.0 * sin((5.0 + 5.0 * s) * r);
        float s11 = 3.0/10.0 * Q(r, x, y) + exp(-exp(exp0));
        float s12 = (1.0 + P(r, x, y)) * J(r, x, y) * Ur(r, x, y);

      
        sum += s0 + s10 * s11 * s12;   
    }
    return sum;
}

float H(float s, float x, float y)
{
    float prod = 1.0;
    for (float r = 0.0; r < kSize; r += 1.0)
    {
        prod *= (1.0 - J(r, x, y));
    }
        float exp0 = 100.0 *
          (sqrt((x - 41.0/50.0) * (x - 41.0/50.0) + (y - 3.0/5.0) * (y - 3.0/5.0))
           - 1.0/100.0);
  
    return (1.0 + pow(-1.0, s) * s / 2.0) * U(s, x, y)
      + (1.0/10.0 + s / 4.0 + (y - x*x/3.0 - 1.0/2.0) *
         (1.0/25.0 + 17.0/300.0 * (s*s - s))) * prod
	     + (5.0/2.0 - 7.0/4.0 * s) * K(x, y)
          - exp(-exp(exp0));
}

float F(float x)
{
    return clamp(abs(exp(-exp(-1000.0 * x))
               * pow(abs(x), exp(-exp(1000.0 * (x - 1.0))))), 0.0, 1.0);
}

void main() {
  vec2 s = gl_FragCoord.xy / resolution.xy;
  float m = s.x * 2000.0 + 250.0;
  float n = 1200.0 - s.y * 1200.0;
    
  gl_FragColor = vec4(
    F(H(0.0, (m - 1000.0) / 400.0, (801.0 - n) / 400.0)),
    F(H(1.0, (m - 1000.0) / 400.0, (801.0 - n) / 400.0)),
    F(H(2.0, (m - 1000.0) / 400.0, (801.0 - n) / 400.0)),
    1.0);
}