<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'role',
        'password',
    ];

    // 🔴 Remove password => hashed casting
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function shop() {
        return $this->hasOne(Shop::class);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }

    public function isAdmin() {
        return $this->role === 'admin';
    }

    public function isShopOwner() {
        return $this->role === 'shop_owner';
    }

    public function canAccessPanel(Panel $panel): bool {
        return in_array($this->role, ['admin', 'shop_owner']);
    }
}
