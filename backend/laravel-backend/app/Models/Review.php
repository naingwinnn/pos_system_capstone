<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    // A review belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A review belongs to a shop
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
