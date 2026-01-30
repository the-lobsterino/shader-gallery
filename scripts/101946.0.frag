uniform float _CurrentHealth;
uniform float _MaxHealth;
uniform float _CurrentShield;
uniform float _TickEveryHealth;
uniform float _TickThickness;
uniform float _TickYOffset;
uniform float _BigTickEveryHealth;
uniform float _BigTickThickness;
uniform vec4 _BarColor;
uniform vec4 _BackgroundColor;
uniform vec4 _ShieldColor;
uniform vec4 _TickColor;
uniform vec4 _BigTickColor;

in vec4 vertex;
in vec2 uv;

out vec2 fragUV;
out float Tick;
out float BigTick;

void main()
{
    gl_Position = vec4(vertex.xy, 0.0, 1.0);
    fragUV = uv;
    Tick = uv.x * (_MaxHealth / _TickEveryHealth);
    BigTick = uv.x * (_MaxHealth / _BigTickEveryHealth);
}

vec4 GetColor()
{
    float healthPercent = _CurrentHealth / _MaxHealth;
    float shieldPercent = _CurrentShield / _MaxHealth;
    float barPercent = healthPercent + shieldPercent;

    if (barPercent > 1.0) {
        barPercent = 1.0;
    }
    else if (barPercent < 0.0) {
        barPercent = 0.0;
    }

    float tickamnt = (_MaxHealth / _TickEveryHealth);
    float4 tickColor = _TickColor;
    float tickWidth = (_TickThickness*0.005)*tickamnt;
    float tickSpacing = 1;
    float tickPosition = tickSpacing;
    while (tickPosition <= tickamnt) { 
        if (Tick > (tickPosition - tickWidth) && Tick < (tickPosition + tickWidth) && fragUV.y > _TickYOffset) {
            return tickColor;
        }
        tickPosition += tickSpacing;
    }
    
    float bigTickamnt = (_MaxHealth / _BigTickEveryHealth);
    float4 bigTickColor = _BigTickColor;
    float bigTickWidth = (_BigTickThickness*0.005)*bigTickamnt;
    float bigTickSpacing = 1;
    float bigTickPosition = bigTickSpacing;
    while (bigTickPosition <= bigTickamnt) { 
        if (BigTick > (bigTickPosition - bigTickWidth) && BigTick < (bigTickPosition + bigTickWidth)) {
            return bigTickColor;
        }
        bigTickPosition += bigTickSpacing;
    }

    if (fragUV.x > barPercent) {
        return _BackgroundColor;
    }

    if ((fragUV.x > (healthPercent - shieldPercent)) && (_CurrentHealth >= _MaxHealth)) {
        return _ShieldColor;
    } else if ((fragUV.x > (barPercent - shieldPercent)) && (_CurrentHealth <= _MaxHealth)) {
        return _ShieldColor;
    }

    return _BarColor;
}

out vec4 fragColor;

void main()
{
    fragColor = GetColor();
}